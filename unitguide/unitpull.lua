#!/usr/bin/env lua
-- ##################
-- ZERO-K
-- Unit Stats Import
-- ##################

require 'lfs'
local unitpath = "../zk/units/"
local jsonpath = "./public/data/"
local libpath = "./lib/"
local unitfiles = {}

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

-- collect all the unit files into a table
c = 1
for file in lfs.dir(unitpath) do
	for title, ext in string.gmatch(file, "([%w|_]+)\.(%w+)") do
		-- ignore if it's not a .lua file
		if ext == "lua" then
			unitfiles[c] = title
			c = c+1
		end
	end
end

--require 'pl.pretty'.dump(unitfiles)

-- read all these files and acquire the unit data
unitdefs = {}
for k, v in pairs(unitfiles) do 
	local unit = dofile(unitpath..v..".lua")
	for k, v in pairs(unit) do 
		unitdefs[k] = v
	end
end

-- filter those giant objects down to essentials..
local units = {title = 'Units', data = {}}
local factories = {title = 'Factories', data = {}}
local chickens = {title = 'Chickens', data = {}}
for k, v in pairs(unitdefs) do
	local s = {}
	
	-- these all seem well defined
	s['handle'] = v['unitname']
	s['name'] = v['name']
	s['desc'] = v['description']
	s['cost'] = v['buildcostmetal']
	s['builder'] = v['builder']
	s['speed'] = v['maxvelocity']
	s['slope'] = v['maxslope']
	s['sight'] = v['sightdistance']
	s['health'] = v['maxdamage']
	
	-- are some helptexts missing?
	if setContains(v, 'customparams') then
		s['longdesc'] = v['customparams']['helptext']
	end
	
	-- some units have no weapons table!
	if setContains(v, 'weapons') then
		-- some units have more than one gun, but never mind...
		local gun = table.remove(v['weapons'],1)
		-- some units have empty weapons table!
		if gun and setContains(gun, 'def') then
			-- comply with lowerkeys!
			local gunName = string.lower(gun['def'])
			s['gun'] = gunName
			s['damage'] = math.ceil(v['weapondefs'][gunName]['damage']['default'])
			s['range'] = v['weapondefs'][gunName]['range']
			s['reload'] = v['weapondefs'][gunName]['reloadtime']
			if setContains(s, 'damage') and setContains(s, 'reload') then
				s['dps'] = math.floor(s['damage']/s['reload'])
			end
		end
	end
	-- no weapons
	if (s['gun']) == nil then
		s['gun'] = "unarmed"
		s['dps'] = 0
		s['damage'] = 0
		s['range'] = 0
		s['reload'] = 0
	end
	
	-- forget about chickens
	if string.find(v['description'], "Chicken") ~= nil
		or string.find(v['description'], "Nest") ~= nil then
		table.insert(chickens['data'], s)
	-- it's a factory, not a unit!
	elseif setContains(v, 'buildoptions') and next(v['buildoptions']) ~= nil then
		-- what can I build?
		s['builds'] = v['buildoptions']
		table.insert(factories['data'], s)
	else
		table.insert(units['data'], s)
	end
end

-- save all to json files
JSON = (loadfile (libpath.."JSON.lua"))()
for _,r in pairs({factories, chickens, units}) do
	local json = JSON:encode_pretty(r)
	local file = io.open(jsonpath..r['title']..".json", "w")
	file:write(json)
	file:close()
end
