require 'sinatra'
require 'sinatra/base'
require 'pmux-logview/logger_wrapper'

module Pmux
  module LogView
    module AuthHelper
      def self.init password_file_path
        @logger = LoggerWrapper.instance()
        self.load_config(password_file_path) if @auth_db.nil?
      end

      def self.update password_file_path
        self.load_config(password_file_path)
      end

      def self.load_config password_file_path
        @auth_db = {} if @auth_db.nil?
        begin
          stat = File.stat(password_file_path)
          mode = "%o" % stat.mode
          if mode[-3, 3] != "600"
            @logger.warn("password file permission is not 600 (#{password_file_path})")
          end
          new_auth_db = YAML.load_file(password_file_path)
        rescue Errno::ENOENT
          @logger.warn("not found password file (#{password_file_path})")
        rescue Errno::EACCES
          @logger.warn("can not access password file (#{password_file_path})")
        rescue Exception => e
          @logger.warn("error occurred in password loading: #{e}")
          @logger.warn(e.backtrace.join("\n"))
        end
          @auth_db = new_auth_db
      end

      def self.authenticated request, auth
        auth ||=  Rack::Auth::Basic::Request.new(request.env)
        if auth.provided? && auth.basic? && auth.credentials
          user, pass = auth.credentials
          if @auth_db && @auth_db[user] && @auth_db[user]["pass"] && @auth_db[user]["pass"] == pass
            return user
          end
        end
        return nil
      end

      def self.check_auth! request, response, auth, password_file_path
        user = self.authenticated(request, auth)
        if user.nil?
          response['WWW-Authenticate'] = %(Basic realm="Restricted Area")
          throw(:halt, [401, "Unauthorized"])
        end
        return user
      end
    end

    Sinatra.helpers AuthHelper
  end
end
