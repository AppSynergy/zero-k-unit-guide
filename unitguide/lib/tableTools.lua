-- need this defined in order to parse files
function lowerkeys(t)
  local tn = {}
  for i,v in pairs(t) do
    local typ = type(i)
    if type(v)=="table" then
      v = lowerkeys(v)
    end
    if typ=="string" then
      tn[i:lower()] = v
    else
      tn[i] = v
    end
  end
  return tn
end

-- simple check
function setContains(set, key)
    return set[key] ~= nil
end

-- table maxima
function table.max(t)
   local mv
   for _, value in pairs(t) do
      mv = ((not mv or value > mv) and value)  or mv
   end
   return mv
end