<?php
    
    $config = require("Config.php");
    
    $dsn = "mysql:host=" . $config["db_host"] . ";dbname=" . $config["db_name"];
    $db = new PDO($dsn, $config["db_user"], $config["db_pass"]);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    function getData($sql, $values = array())
    {
        global $db;
    
        $statement = $db->prepare($sql);
        $statement->execute($values);
        
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }
    
    function insertRows($table, $fields, $data, $ignoreDuplicates = false)
    {
        global $db;
        
        $db->beginTransaction();
        
        $values = array();
        $rows = array();
        
        // Build a row for each element of the data
        if (count($fields) > 1)
        {
            foreach ($data as $d)
            {
                $rows[] = "(" . implode(",", array_fill(0, sizeof($d), "?")) . ")";     # Value placeholders
                $values = array_merge($values, array_values($d));                       # Value list
            }
        }
        else
        {
            // Single value
            $rows = array_fill(0, count($data), "(?)");
            $values = array_values($data);
        }
        
        // Build the query
        $sql = sprintf("INSERT INTO %s (%s) VALUES %s", $table, implode(",", $fields), implode(",", $rows));
        if ($ignoreDuplicates)
        {
            $sql .= " ON DUPLICATE KEY UPDATE " . $fields[0] . "=" . $fields[0];
        }
        
        $statement = $db->prepare($sql);
        $statement->execute($values);
        
        $db->commit();
        
        return $statement->rowCount();
    }
    
    function updateTimestamps($table, $stampField, $keyField = "", $keyValues = null)
    {
        global $db;
        
        $db->beginTransaction();
        
        if (strlen($keyField) > 0 and $keyValues !== null and sizeof($keyValues) > 0)
        {
            $sql = sprintf("UPDATE %s SET %s = NOW() WHERE %s IN (%s)", $table, $stampField, $keyField, implode(",", array_fill(0, sizeof($keyValues), "?")));
            $statement = $db->prepare($sql);
            $statement->execute($keyValues);
        }
        else
        {
            $sql = sprintf("UPDATE %s SET %s = NOW()", $table, $stampField);
            $statement = $db->prepare($sql);
            $statement->execute();
        }
        
        $db->commit();
        
        return $statement->rowCount();
    }

?>