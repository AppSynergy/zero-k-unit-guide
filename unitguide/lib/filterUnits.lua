function filterUnits()
	
	-- collect all the unit files into a table
	local unitdefs = {}
	c = 1
	for file in lfs.dir(unitpath) do
		for title, ext in string.gmatch(file, "([%w|_]+)\.(%w+)") do
			-- ignore if it's not a .lua file
			if ext == "lua" then
				local unit = dofile(unitpath..title..".lua")
				for k, v in pairs(unit) do 
					unitdefs[c] = v
				end
				c = c+1
			end
		end
	end
		
	
	-- filter those giant objects down to essentials..
	local units = {title = 'Units', data = {}}
	local factories = {title = 'Factories', data = {}}
	local chickens = {title = 'Chickens', data = {}}
	local statics = {title = 'Statics', data = {}}
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
		
		
		if setContains(v, 'buildpic') then
			s['pic'] = string.lower(v['buildpic'])
		end
		
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
				local gunDamages = v['weapondefs'][gunName]['damage']
				-- take the largest damage class - probably the right one!
				s['damage'] = math.ceil(table.max(gunDamages))
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
			or string.find(v['unitname'], "chicken") ~= nil 
			or string.find(v['description'], "Nest") ~= nil then
			table.insert(chickens['data'], s)
		-- it's a factory, not a unit!
		elseif setContains(v, 'buildoptions') and next(v['buildoptions']) ~= nil then
			-- what can I build?
			s['builds'] = v['buildoptions']
			table.insert(factories['data'], s)
		-- statics don't jump and aren't silo missiles
		elseif setContains(s, 'speed') and s['speed'] == 0 and
			v['script'] ~= "cruisemissile.lua" then
			table.insert(statics['data'], s)
		-- must be a unit, I suppose
		else
			table.insert(units['data'], s)
		end
	end
	return factories, chickens, units, statics
end