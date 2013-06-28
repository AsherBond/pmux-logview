RUBY_VERID?=default
RAKE?=rake

default: build

build: clean
	$(RAKE) build

install: clean
	$(RAKE) install

rpmbuild: clean
	cd rpm && make clean
	$(RAKE) build
	cd rpm && make RUBY_VERID=$(RUBY_VERID)

clean:
	cd rpm && make clean
	rm -rf pkg
