<?php
    
    function extractLocationData($dataArray, $processLocation = true)
    {
        // Validate input type
        if (is_array($dataArray) == false)
            return null;
        
        // Validate input content
        if (array_key_exists("location", $dataArray) == false)
            return null;
        
        if (strlen($dataArray["location"]) == 0)
            return null;
        
        // default values
        $data = array("location" => null, "latitude" => null, "longitude" => null);
        
        // Process the location if desired
        $data["location"] = $dataArray["location"];
        if ($processLocation)
        {
            $proc = processLocation($data["location"]);
            if ($proc)
                $data["location"] = $proc;
        }
        
        // Check for provided coordinates
        if (array_key_exists("geo_lat", $dataArray) and array_key_exists("geo_lng", $dataArray))
        {
            $data["latitude"] = $dataArray["geo_lat"];
            $data["longitude"] = $dataArray["geo_lng"];
        }
        
        return $data;
    }
    
    function processLocation($location)
    {
        $removeAll = array("EBO", "EB", "WBO", "WB", "NBO", "NB", "SBO", "SB");
        $removeStart= array("#", "APT");
        
        $suffixes = array("RD", "DR", "ST", "TRL", "AVE", "LN", "BLVD", "WAY", "PKWY", "CIR", "CT", "PL", "TER");
        
        // normal -> [ abbreviations ]
        $abbrev = array(
            "RD" => array("ROAD"), "ST" => array("STREET"), "DR" => array("DRIVE"), "CT" => array("COURT"),
            "LN" => array("LANE"), "WAY" => array("WY"), "PL" => array("PLC", "PLACE"), "TER" => array("TERRACE"),
            "PKWY" => array("PY", "PK", "PKY", "PARKWAY"), "AVE" => array("AV", "AVENUE"),
            "TRL" => array("TL", "TR", "TRAIL"), "CIR" => array("CR", "CIRCLE"), "PLZ" => array("PZ", "PLAZA"),
            "BLVD" => array("BV", "BVD", "BOULEVARD"), "EXPRESSWAY" => array("EXP", "EXPY")
        );
        
        $location = str_replace("/", " AND ", $location);
        $location = str_replace("  ", " ", $location);
        
        $returnLocation = array();
        
        $intersection = !(strpos($location, " AND ") == false);
        $addresses = explode(" AND ", $location);
        foreach ($addresses as $address)
        {
            $elements = explode(" ", $address);
            
            // Check for a street number
            if (($intersection == false) and (ctype_digit($elements[0]) == false))
            {
                return false;
            }
            
            $foundSuffix = false;
            foreach ($elements as $e)
            {
                if (strlen(trim($e)) === 0) continue;    # Skip empty elements
                
                $e = strtoupper($e);
                
                // Remove pieces that are unnecesarry or that the geocoding API
                //   does not normally understand.
                if (in_array($e, $removeAll))
                    continue;
                
                // Remove confusing prefixes (apartment or suite numbers typically)
                $badElement = false;
                foreach ($removeStart as $rs)
                {
                    if (substr($e, 0, strlen($rs)) === $rs)
                    {
                        $badElement = true;
                        break;
                    }
                }
                if ($badElement)    # If the element is bad, skip it.
                    continue;
                    
                // Normalize abbreviations
                foreach ($abbrev as $normal => $abs)
                {
                    foreach ($abs as $ab)
                    {
                        if ($e === $ab) # If the element is an abbreviation
                        {
                            $e = $normal;
                            break 2;
                        }
                    }
                }
                
                // Check for suffixes, which signify the end of the useful part of the address
                if ($foundSuffix == false)
                {
                    if (in_array($e, $suffixes)) $foundSuffix = true;
                }
                else
                    break;
                
                // Add the finished element to the return location
                $returnLocation[] = $e;
            }
            
            // Add the intersection delimeter if needed
            if ($intersection)
                $returnLocation[] = "AND";
        }
        
        // If processing an intersection, remove the final "AND"
        if ($intersection)
            array_pop($returnLocation);
        
        return implode(" ", $returnLocation);
    }
    
?>