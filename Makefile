BASE = .

ISTANBUL = ./node_modules/.bin/istanbul

all: server

node_modules:
	npm install

server: test
	node server/index.js

test: node_modules
	$(ISTANBUL) cover ./node_modules/.bin/_mocha -- test/ -R spec

report: test
	open coverage/lcov-report/index.html

.PHONY: test server report


