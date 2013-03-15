require 'sinatra'
require 'sinatra/base'
require 'json'
require 'erb'
require 'fileutils'
require 'logger'

module Pmux
  module LogView
    class Controller < Sinatra::Base
      @@initialized = false
      @@foreground = false
      @@cache_dir_path = "/var/tmp/pmux-logview"
      @@password_file_path = "/etc/pmux-logview/password"
      @@log_dir_path = "/var/log/pmux-logview"
      @@log_filename = "./pmux-logview.log"
      @@log_level = "info"
      @@syslog_facility = "daemon"
      @@use_syslog = false
      @@use_basic_auth = true
      @@default_user = "pmux"
      @@model = nil
      @@logger = nil
      @user = nil
      set :public_folder, File.dirname(__FILE__) + '/static'
      set :views, File.dirname(__FILE__) + "/views"
      enable :logging
      helpers AuthHelper

      def Controller.setup(args)
        args.each_key{|key|
          case key
          when "foreground"
              @@foreground  = args[key]
          when "cache_dir_path"
              @@cache_dir_path = args[key]
          when "use_basic_auth"
              @@use_basic_auth = args[key]
          when "password_file_path"
              @@password_file_path = args[key]
          when "log_dir_path"
              @@log_dir_path = args[key]
          when "log_level"
              @@log_level = args[key]
          when "use_syslog"
              @@use_syslog = args[key]
          when "syslog_facility"
              @@syslog_facility = args[key]
          when "default_user"
              @@default_user = args[key]
          end
        }
        log_file_path = File.expand_path([@@log_dir_path, @@log_filename].join(File::SEPARATOR))
        @@logger.foreground(@@foreground)
        @@logger.open(log_file_path, @@log_level, @@use_syslog, @@syslog_facility)
        AuthHelper.update(@@password_file_path)
        @@model = Model.new(@@cache_dir_path)
      end

      configure do
        log_file_path = File.expand_path([@@log_dir_path, @@log_filename].join(File::SEPARATOR))
        @@logger = LoggerWrapper.instance()
        @@logger.init()
        @@logger.open(log_file_path, @@log_level, @@use_syslog, @@syslog_facility)
        use Rack::CommonLogger, @@logger
        AuthHelper.init(@@password_file_path)
        @@model = Model.new(@@cache_dir_path)
      end

      def logger
          return env['user.logger'] || env['rack.logger']
      end

      get '/' do
        @user = @@default_user if @user.nil?
        @user = AuthHelper.check_auth!(request, response, @auth, @@password_file_path) if @@use_basic_auth
        @@logger.info("access user #{@user}")
        erb :index
      end

      get '/detail' do
        @user = @@default_user if @user.nil?
        @user = AuthHelper.check_auth!(request, response, @auth, @@password_file_path) if @@use_basic_auth
        @@logger.info("access user #{@user}")
        @job_id = params[:job_id]
        erb :detail
      end

      get '/log/job' do
        @user = @@default_user if @user.nil?
        @user = AuthHelper.check_auth!(request, response, @auth, @@password_file_path) if @@use_basic_auth
        @@logger.info("access user #{@user}")
        data = {}
        validations = {
            "sort_key" => { "default" => "start_time", "type" => String, "values" => [ "job_id", "mapper", "start_time", "end_time", "elapsed_time"] },
            "sort_order" => { "default" => "desc", "type" => String, "values" => [ "asc", "desc" ] },
            "type" => { "default" => "archive", "type" => String, "values" => [ "archive", "update" ] },
            "nitems" => { "default" => 20, "type" => Integer, "values" => nil  },
            "page" => { "default" => 0, "type" => Integer, "values" => nil },
            "jobs_cookie" => { "default" => 0, "type" => Integer, "values" => nil },
        }
        validations.each_key{|key|
          if params.key?(key)
            if (validations[key]["type"] == Integer)
              data[key] = params[key].to_i
            else
              data[key] = params[key]
            end
            if (validations[key]["type"] == Integer)
              data[key] = validations[key]["default"] if data[key] <= 0
            else 
              data[key] = validations[key]["default"] if !data[key].kind_of?(validations[key]["type"])
            end
            data[key] = validations[key]["default"] if !validations[key]["values"].nil? && !validations[key]["values"].include?(data[key])
          else
            data[key] = validations[key]["default"]
          end
        }
	content_type :json
	return JSON.generate(@@model.get_log_job(@user, data))
      end

      get '/log/job/:job_id/detail' do
        @user = @@default_user if @user.nil?
        @user = AuthHelper.check_auth!(request, response, @auth, @@password_file_path) if @@use_basic_auth
        @@logger.info("access user #{@user}")
	content_type :json
	JSON.generate(@@model.get_log_job_detail(@user, params[:job_id]))
      end

      get '/log/dispatcher' do
        @user = @@default_user if @user.nil?
        @user = AuthHelper.check_auth!(request, response, @auth, @@password_file_path) if @@use_basic_auth
        @@logger.info("access user #{@user}")
        content_type :json
	JSON.generate(@@model.get_log_dispatcher(@user))
      end
    end
  end
end

