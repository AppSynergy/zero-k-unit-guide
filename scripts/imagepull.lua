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
factories, chickens, units, statics = filterUnits()
unitPicHandles = {}
for _, u in pairs(units['data']) do
	if setContains(u, 'pic') then
		unitPicHandles[u.pic] = u.name
	end
end

-- collect all the unit pics into a table
require(libpath..'/copyFile')
for file in lfs.dir(unitpicspath) do
	for title, ext in string.gmatch(file, "([%w|_]+)\.(%w+)") do
		-- ignore if it's not a .lua file
		if ext == "png" and setContains(unitPicHandles, title.."."..ext) then
			print("Copying: "..title.."."..ext)
			copyFile(
				title..".png", -- srcName
				unitpicspath,  -- srcPath
				title..".png", -- dstName
				imgpath        -- dstPath
			)
		end
	end
end

--require 'pl.pretty'.dump(unitPicHandles)