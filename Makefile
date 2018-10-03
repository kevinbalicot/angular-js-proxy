DIST_DIR = ./dist
BIN_DIR = ./node_modules/.bin
BIN_FILE = $(DIST_DIR)/angular-js-proxy.js

build: $(DIST_DIR) node_modules
	$(BIN_DIR)/browserify src/index.js -t [ babelify ] | $(BIN_DIR)/uglifyjs --keep-fnames -c -o $(BIN_FILE)

clean:
	rm -rf ./node_modules && rm -rf $(DIST_DIR)

.PHONY: build clean

node_modules: package.json
	npm install --ignore-scripts

$(DIST_DIR):
	mkdir -p $@
