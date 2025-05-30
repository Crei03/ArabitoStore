<?php
class DBHandler
{
    private $conn;

    public function __construct($conn = null)
    {
        mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

        // Si no se proporciona una conexión, usar la función conectarBD de config.php
        if ($conn === null) {
            require_once __DIR__ . '/config.php';
            $this->conn = conectarBD();
        } else {
            $this->conn = $conn;
        }

        $this->conn->query("SET SESSION sql_mode = 'STRICT_ALL_TABLES'");
    }

    private function getParamTypes($values)
    {
        return implode("", array_map(function ($value) {
            if (is_int($value))
                return "i";
            if (is_float($value))
                return "d";
            if (is_null($value))
                return "s";
            return "s";
        }, $values));
    }

    public function insert($table, $columns, $values)
    {
        try {
            $cols = implode(", ", $columns);
            $placeholders = implode(", ", array_fill(0, count($values), "?"));
            $types = $this->getParamTypes($values);

            $stmt = $this->conn->prepare("INSERT INTO $table ($cols) VALUES ($placeholders)");
            $stmt->bind_param($types, ...$values);
            $stmt->execute();

            $insertedId = $stmt->insert_id;
            return [
                "status" => "ok",
                "message" => "Registro insertado correctamente",
                "insertedId" => $insertedId
            ];
        } catch (Exception $e) {
            return [
                "status" => "error",
                "message" => "Error al insertar: " . $e->getMessage()
            ];
        } finally {
            if (isset($stmt))
                $stmt->close();
        }
    }

    public function selectAll($table)
    {
        try {
            $result = $this->conn->query("SELECT * FROM $table");
            return [
                "status" => "ok",
                "data" => $result->fetch_all(MYSQLI_ASSOC)
            ];
        } catch (Exception $e) {
            return [
                "status" => "error",
                "message" => "Error al obtener registros: " . $e->getMessage()
            ];
        }
    }

    public function selectOne($table, $idColumn, $idValue)
    {
        try {
            $stmt = $this->conn->prepare("SELECT * FROM $table WHERE $idColumn = ?");
            $stmt->bind_param($this->getParamTypes([$idValue]), $idValue);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();

            return $result
                ? ["status" => "ok", "data" => $result]
                : ["status" => "error", "message" => "Registro no encontrado"];
        } catch (Exception $e) {
            return ["status" => "error", "message" => "Error al buscar: " . $e->getMessage()];
        } finally {
            if (isset($stmt))
                $stmt->close();
        }
    }

    public function update($table, $columns, $values, $idColumn, $idValue)
    {
        try {
            $set = implode(" = ?, ", $columns) . " = ?";
            $types = $this->getParamTypes($values) . $this->getParamTypes([$idValue]);

            $stmt = $this->conn->prepare("UPDATE $table SET $set WHERE $idColumn = ?");
            $stmt->bind_param($types, ...array_merge($values, [$idValue]));
            $stmt->execute();

            return [
                "status" => "ok",
                "message" => "Registro actualizado correctamente"
            ];
        } catch (Exception $e) {
            return [
                "status" => "error",
                "message" => "Error al actualizar: " . $e->getMessage()
            ];
        } finally {
            if (isset($stmt))
                $stmt->close();
        }
    }

    public function delete($table, $idColumn, $idValue)
    {
        try {
            $stmt = $this->conn->prepare("DELETE FROM $table WHERE $idColumn = ?");
            $stmt->bind_param($this->getParamTypes([$idValue]), $idValue);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {
                return [
                    "status" => "ok",
                    "message" => "Registro eliminado correctamente"
                ];
            } else {
                return [
                    "status" => "error",
                    "message" => "Registro no encontrado para eliminar"
                ];
            }
        } catch (Exception $e) {
            return [
                "status" => "error",
                "message" => "Error al eliminar: " . $e->getMessage()
            ];
        } finally {
            if (isset($stmt))
                $stmt->close();
        }
    }

    public function getConnection()
    {
        return $this->conn;
    }

}
?>