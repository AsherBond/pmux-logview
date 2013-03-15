# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'pmux-logview/version'

Gem::Specification.new do |spec|
  spec.name          = "pmux-logview"
  spec.version       = Pmux::LogView::VERSION
  spec.authors       = ["hiroyuki kakine"]
  spec.email         = ["kakine@iij.ad.jp"]
  spec.description   = %q{Pmux log viewer}
  spec.summary       = %q{Pmux log viwwer}
  spec.homepage      = "https://github.com/iij/pmux-logview"
  spec.license       = "MIT"

  spec.files         = `find . -maxdepth 1 -name '.gitignore' -prune -o -type f -print; find {bin,lib,conf,rpm} -name '.svn' -prune -o -type f -print`.split().map { |f| f.strip().sub("./", "") }
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_dependency('gflocator', '>= 0.0.1')
  spec.add_dependency('pmux', '>= 0.1.1')
  spec.add_dependency('json', '>= 1.6.1')
  spec.add_dependency('sinatra', '>= 0.3.4')
  spec.add_development_dependency "bundler", ">= 1.2.1"
  spec.add_development_dependency "rake"
end
