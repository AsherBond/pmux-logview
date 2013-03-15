require 'singleton'
require 'logger'
require 'syslog'

module Pmux
  module LogView
    class LoggerWrapper
      include Singleton
    
      @@log_level_map = {
        'debug' => Logger::DEBUG,
        'info' => Logger::INFO,
        'warn' => Logger::WARN,
        'error' => Logger::ERROR,
        'fatal' => Logger::FATAL
      }

      @@facility_map = {
        'user' => Syslog::LOG_USER,
        'daemon' => Syslog::LOG_DAEMON,
        'local0' => Syslog::LOG_LOCAL0,
        'local1' => Syslog::LOG_LOCAL1,
        'local2' => Syslog::LOG_LOCAL2,
        'local3' => Syslog::LOG_LOCAL3,
        'local4' => Syslog::LOG_LOCAL4,
        'local5' => Syslog::LOG_LOCAL5,
        'local6' => Syslog::LOG_LOCAL6,
        'local7' => Syslog::LOG_LOCAL7
      }

      def init 
        @syslog = false
        @logger = nil
        @serverity = Logger::INFO
        @log_dir_path = nil
      end

      def foreground foreground
        @foreground = foreground
      end

      def fixup_level level
        return level if @@log_level_map.key?(level)
        return "info"
      end

      def get_facility facility
        if !facility.nil? && @@facility_map.key?(facility)
          return @@facility_map[facility]
        end
        return Syslog::LOG_USER
      end

      def open log_file_path, log_level, use_syslog, facility_string
        # ログをオープンする
        # すでに開いている状態で呼ばれるとリオープンする
        @serverity = @@log_level_map[fixup_level(log_level)]
        @log_dir_path = File.dirname(log_file_path) 
        FileUtils.mkdir_p(@log_dir_path) if !File.exist?(@log_dir_path)
        old_logger = @logger
        @logger = nil
        begin
          @logger = Logger.new(log_file_path, 'daily')
          @logger.level = @serverity
          old_logger.close() if !old_logger.nil?
        rescue Errno::ENOENT => e
          @logger = old_logger if !old_logger.nil?
          warn("not found log file (#{log_file_path})")
          warn("error: #{e}")
        rescue Errno::EACCES => e
          @logger = old_logger if !old_logger.nil?
          warn("can not access log file (#{log_file_path})")
          warn("error: #{e}")
        end
        if @syslog
          Syslog.close()
          @syslog = false
        end
        if use_syslog
          facility = get_facility(facility_string)
          Syslog.open("pmux-logview", Syslog::LOG_PID, facility)
          @syslog = true
        end
      end

      def close
        @logger.close() if !@logger.nil?
        @logger = nil
        Syslog.close() if @syslog
        @syslog = false
      end

      def write msg
          @logger.info(msg.rstrip()) if !@logger.nil?
          Syslog.info("#{msg.rstrip()}") if @syslog
      end

      def debug msg
          @logger.debug(msg) if !@logger.nil?
          Syslog.debug("#{msg}") if @syslog
          puts "[debug] #{msg}" if @foreground && @@log_level_map["debug"] >= @serverity
      end

      def info msg
          @logger.info(msg) if !@logger.nil?
          Syslog.info("#{msg}") if @syslog
          puts "[info] #{msg}" if @foreground && @@log_level_map["info"] >= @serverity
      end
    
      def warn msg
          @logger.warn(msg) if !@logger.nil?
          Syslog.warning("#{msg}") if @syslog
          puts "[warn] #{msg}" if @foreground && @@log_level_map["warn"] >= @serverity
      end

      def error msg
          @logger.error(msg) if !@logger.nil?
          Syslog.err("#{msg}") if @syslog
          puts "[error] #{msg}" if @foreground && @@log_level_map["error"] >= @serverity
      end

      def fatal msg
          @logger.fatal(msg) if !@logger.nil?
          Syslog.crit("#{msg}") if @syslog
          puts "[fatal] #{msg}" if @foreground && @@log_level_map["fatal"] >= @serverity
      end
    end
  end
end
