
'''
    Web page parsing script for 'Orlando Police Department' (OPD)
    http://www1.cityoforlando.net/opd/activecalls/activecad.xml
    http://www1.cityoforlando.net/opd/activecalls/selfcad.xml    
'''

def getValue(xml, eName):
    try:
        return xml.split("<" + eName + ">")[1].split("</" + eName + ">")[0].strip()
    except IndexError:
        return ""
    
replacements.update({
    "EW": "FL-408", "BEELINE": "FL-528", "I4": "INTERSTATE 4",
    "TURNPIKE": "FLORIDA TURNPIKE", "TPK": "FLORIDA TURNPIKE", 
    "GREENWAY": "FL-417", "GREENEWAY": "FL-417"
})

types = { 
    "Traffic": [ "HIT AND RUN", "ON HIGHWAY", "SIGNAL OUT", "TRAFFIC" ],
    "Patrol": [ "HOUSE/BUSINESS CHECK", "PATROL" ],
    "Death": [ "MAN DOWN", "DEAD PERSON", "SUICIDE", "MURDER" ],
    "Fire": [ "FIRE" ]
}
    
calls = data.split("<CALL ")
for idx in range(1, len(calls)):
    try:
        call = calls[idx].split("</CALL>")[0]
    
        # Parse page data
        row_data = { }
        
        meta = { }
        meta["call_number"]     = call.split("incident=\"")[1].split("\">")[0]
        meta["call_time"]       = getValue(call, "DATE")
        meta["location"]        = getValue(call, "LOCATION")
        meta["district"]        = getValue(call, "DISTRICT")
        meta["description"]     = getValue(call, "DESC")
        
        meta["description"] = meta["description"].replace("&amp;", "&")
        
        # Interpret call type from description
        call_type = "Police"
        desc = meta["description"].upper()
        
        if desc.startswith("ACCIDENT"):
            # This special case avoids 'airplane accident' and 'industrial accident'
            call_type = "Traffic"
        else:
            for sType, termList in types.items():
                for term in termList:
                    if term in desc:
                        call_type = sType
            
        # Determine location string to geocode
        location = meta["location"]
        location = location.replace("CENTRAL FLORIDA GREENEWAY", "FL-417")
        if " / " in location:
            location = location.replace(" / ", " AND ")
        ls = location.split()
        if len(ls) > 2 and ls[1] == "BLOCK":
            location = ls[0] + " " + ' '.join(ls[2:])
        
        row_data["location"] = location
        row_data["category"] = call_type
        row_data["key"] = "OPD-" + meta["call_number"]
        row_data["meta"] = meta
        
        # Add call to list
        results.append(row_data)
    except Exception as ex:
        print("Error parsing 'OPD' index {0}: {1}".format(idx, ex))
