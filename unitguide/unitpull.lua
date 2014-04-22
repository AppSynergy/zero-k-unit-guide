#!/usr/bin/env lua
-- ##################
-- ZERO-K
-- Unit Stats Import
-- ##################

require 'lfs' -- file system
unitpath = "../zk/units/"
jsonpath = "./public/data/"
libpath = "./lib/" -- other lua

require(libpath..'/tableTools')

-- collect relevant unit stats
require(libpath..'/filterUnits')
factories, chickens, units, statics = filterUnits()

-- save all to json files
JSON = (loadfile (libpath.."JSON.lua"))()
for _,r in pairs({factories, chickens, units, statics}) do
	print("Exporting: "..r['title'].." object")
	local json = JSON:encode_pretty(r)
	local file = io.open(jsonpath..r['title']..".json", "w")
	file:write(json)
	file:close()
end

require 'pl.pretty'.dump(units)