
def merge(old, new):
    # Hash the calls in each collection
    oldCalls = { c.getKey() : c for c in old }
    newCalls = { c.getKey() : c for c in new }

    final = { }

    # Find newly added calls (in new but not old)
    added = { }
    for k, c in newCalls.items():
        if not k in oldCalls:
            added[k] = c

    # Determine which calls have been removed/expired (in old but not new)
    removed = { }
    for k, c in oldCalls.items():
        if (not k in newCalls):
            removed[k] = c
        else:
            final[k] = c

    # Add new calls to the final collection
    final.update(added)

    return final, added, removed
    

class CallData():
    def __init__(self, data):
        if isinstance(data, str):
            self.meta = None    
            self.key = data     # A semi-unique key used to identify the call
        else:
            self.meta = data    # An array of information describing the call
            self.key = None

        self.category = None    # The type of call (Police, Fire, EMS, etc)
        self.source = None      # The CallSource object representing the source of the call
        self.location = None    # The parsed location used for geocoding
        self.coords = None      # The resolved coordinates of the geocoded location for this call

    # Returns a short string identifying the call
    #   Example: Burglary @ 123 Main St
    def getShortDisplayString(self):
        if self.meta is None:
            return "No data" if self.key is None else self.key

        s = self.meta["description"] if "description" in self.meta else "Unidentified"
        
        # Append the location if available
        location = self.meta["location"] if "location" in self.meta else ""
        if len(location) > 0:
            s += " @ " + location

        return s

    def getLongDisplayString(self):
        s = "{0}: {1} [{2}]"
        return s.format(self.getKey(), self.getShortDisplayString(), self.category)
    
    def getKey(self):
        if self.key is None:
            return hash(str(self.meta))
        else:
            return self.key

    # Returns a dictionary with values representing known call data
    def getReportData(self):
        data = { "key": self.key, "category": self.category, "location": self.location, "meta": self.meta }
        if not (self.coords is None):
            data["geo_lat"] = self.coords[0]
            data["geo_lng"] = self.coords[1]
        return data



        
        
