<?php

namespace Core;

use PDO;

class QueryBuilder
{
	private $pdo;
	private $action;
	private $fields = [];
	private $query;
	private $entity;
	private $from;
	private $where;
	private $params = [];
	private $order = [];
	private $limit;
	private $offset;

	public function __construct(?\PDO $pdo = null)
	{
		$this->pdo = $pdo;
	}

	// DELETE

	public function delete (): self
	{
		$this->action = "delete";
		return $this;
	}

	// SELECT

	public function select (...$fields): self
	{
		$this->action = "select";
		$fields = is_array($fields[0]) ? $fields[0] : $fields;
		$this->fields = array_merge($this->fields, $fields);
		return $this;
	}

	public function from (string $table, ?string $alias = null): self
	{
		return $this->init($table, $alias);
	}

	// INSERT

	public function insert (array $entity): self
	{
		$this->action = "insert";
		$this->entity = $entity;
		return $this;
	}

	public function into (string $table, ?string $alias = null): self
	{
		return $this->init($table, $alias);
	}

	// UPDATE

	public function update (string $table, ?string $alias = null): self
	{
		$this->action = "update";
		return $this->init($table, $alias);
	}

	public function set(array $entity): self
	{
		$this->entity = $entity;
		return $this;
	}

	// PARAM

	public function where (string $where): self
	{
		$this->where = $where;
		return $this;
	}

	public function setParam (string $key, $value): self
	{
		$this->params[$key] = $value;
		return $this;
	}

	public function orderBy (string $key, string $direction): self
	{
		$this->order[] = in_array(strtoupper($direction), ['ASC', 'DESC']) ? "$key $direction" : $key;
		return $this;
	}

	public function limit (int $limit): self
	{
		$this->limit = $limit;
		return $this;
	}

	public function offset (int $offset): self
	{
		$this->offset = $offset;
		return $this;
	}

	public function page (int $page): self
	{
		return $this->offset($this->limit * ($page - 1));
	}

	// PREPARE

	public function prepare(): string
	{
		$prepareMethod = 'prepare' . ucfirst($this->action);
		return $this->$prepareMethod();
	}

	public function prepareSelect(): string
	{
		$fields = implode(', ', $this->fields);
		$sql = "SELECT $fields FROM {$this->from}";
		$sql = $this->where ? $sql . " WHERE " . $this->where : $sql;
		$sql = !empty($this->order) ? $sql . " ORDER BY " . implode(', ', $this->order) : $sql;
		$sql = $this->limit > 0 ? $sql . " LIMIT " . $this->limit : $sql;
		$sql = $this->offset !== null ? $sql . " OFFSET " . $this->offset : $sql;
		return $sql;
	}

	public function prepareInsert(): string
	{
		$fields = implode(', ', array_keys($this->entity));
		$values = implode(', ', array_map(function($key) { return ":$key"; }, array_keys($this->entity)));
		$sql = "INSERT INTO {$this->from} ($fields) VALUES ($values)";
		return $sql;
	}

	public function prepareUpdate(): string
	{
		$fields = implode(', ', array_map(function($key) { return "$key=:$key"; }, array_keys($this->entity)));
		$sql = "UPDATE {$this->from} SET $fields";
		$sql = $this->where ? $sql . " WHERE " . $this->where : $sql;
		return $sql;
	}

	public function prepareDelete(): string
	{
		$sql = "DELETE FROM {$this->from}";
		$sql = $this->where ? $sql . " WHERE " . $this->where : $sql;
		return $sql;
	}

	// FETCH (select)

	public function fetch(?string $field = null)
	{
		$query = $this->pdo->prepare($this->prepare());
		$query->execute($this->params);
		$result = $query->fetch();

		if ($result !== false)
		{
			if ($field === null)
			{
				return $result;
			}

			if (isset($result[$field]))
			{
				return $result[$field];
			}
		}

		return null;
	}

	public function fetchAll(): ?array
	{
		$query = $this->pdo->prepare($this->prepare());
		$query->execute($this->params);
		$result = $query->fetchAll();
		return $result !== false ? $result : null;
	}

	// EXECUTION (insert - update - delete)

	public function execute()
	{
		if ($this->query === null)
		{
			$this->query = $this->pdo->prepare($this->prepare());
		}
		$params = $this->action != 'delete' ? array_merge($this->entity, $this->params) : $this->params;
		$this->query->execute($params);
		return $this;
	}

	public function count(): int
	{
		return (int)(clone $this)->select('COUNT(id) count')->fetch('count');
	}

	public function lastInsertId(): int
	{
		return $this->pdo->lastInsertId();
	}

	// INIT

	private function init(string $table, ?string $alias = null): self
	{
		$this->query = null;
		$this->from = $alias !== null ? "$table $alias" : $table;
		return $this;
	}
}