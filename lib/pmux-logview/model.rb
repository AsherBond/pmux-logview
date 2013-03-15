module Pmux
  module LogView
    class Model
      def initialize cache_dir_path
	@log_parser = LogParser.new(cache_dir_path)
      end 

      def get_log_job user, data
	return @log_parser.parse_log_job(user, data)
      end

      def get_log_job_detail user, job_id
	return @log_parser.parse_log_job_detail(user, job_id)
      end

      def get_log_dispatcher user
        return @log_parser.parse_log_dispatcher(user)
      end
    end
  end
end
