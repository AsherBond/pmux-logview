require 'yaml'
require 'optparse'
require 'fileutils'
require 'sinatra'

module Pmux
  module LogView
    class Application
      def initialize
        @config = nil
        @foreground = false
        @config_file_path = "/etc/pmux-logview/pmux-logview.conf"
        @pidfile = "/var/run/pmux-logview.pid"
        @host = "0.0.0.0"
        @port = 28080
      end

      def parse_args
        OptionParser.new do |opt|
          opt.on('-c [config_file_path]', '--config [config_file_path]') {|v| @config_file_path = v}
          opt.on('-F', '--foreground') {|v| @foreground = true}
          opt.parse!(ARGV)
        end
      end

      def load_config
        @config = {} if @config.nil?
        return false if @config_file_path.nil? || @config_file_path == ""
        begin
          new_config = YAML.load_file(@config_file_path)
        rescue Errno::ENOENT
          puts "not found password file (#{@config_file_path})"
        rescue Errno::EACCES
          puts "can not access password file (#{@config_file_path})"
        rescue Exception => e
          puts "error occurred in password loading: #{e}"
          puts e.backtrace.join("\n")
        end
          @config = new_config
      end

      def daemonize
        if !@foreground
          exit!(0) if Process.fork
          Process.setsid
          exit!(0) if Process.fork
          STDIN.reopen("/dev/null", "r")
          STDOUT.reopen("/dev/null", "w")
          STDERR.reopen("/dev/null", "w")
        end
      end

      def run
        initialize()
        parse_args()
        daemonize()
        load_config()
        @config["foreground"] = @foreground
        @pidfile = @config["pidfile"] if @config["pidfile"]
        open(@pidfile, 'w') {|f| f << Process.pid } if @pidfile
        @host = @config["host"] if @config["host"]
        @port = @config["port"] if @config["port"]
        Controller.setup(@config)
        Controller.run! :bind => @host, :host => @host, :port => @port
      end
    end
  end
end

