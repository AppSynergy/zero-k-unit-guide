#!/usr/bin/env lua
-- ##################
-- ZERO-K
-- Unit Pics Import
-- ##################

require 'lfs' -- file system
unitpath = "../zk/units/"
unitpicspath = "../zk/unitpics/"
imgpath = "./public/img/units/"
jsonpath = "./public/data/"
libpath = "./lib/" -- other lua

require(libpath..'/tableTools')

-- what are you real names, and are you units?
require(libpath..'/filterUnits')
factories, chickens, units = filterUnits()
unitHandles = {}
for c,u in pairs(units['data']) do
	unitHandles[u.handle] = u.name
end

-- collect all the unit pics into a table
require(libpath..'/copyFile')
pics = {}
c = 1
for file in lfs.dir(unitpicspath) do
	for title, ext in string.gmatch(file, "([%w|_]+)\.(%w+)") do
		-- ignore if it's not a .lua file
		if ext == "png" and setContains(unitHandles, title) then
			pics[c] = title
			c = c+1
			copyFile(
				title..".png", -- srcName
				unitpicspath,  -- srcPath
				title..".png", -- dstName
				imgpath        -- dstPath
			)
		end
	end
end