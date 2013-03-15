File.umask 0022
ENV['LC_ALL'] = 'C'
Encoding.default_external = 'ascii-8bit' if RUBY_VERSION > '1.9'

require "pmux-logview/logger_wrapper"
require "pmux-logview/application"
require "pmux-logview/auth_helper"
require "pmux-logview/log_parser"
require "pmux-logview/model"
require "pmux-logview/controller"
require "pmux-logview/version"
