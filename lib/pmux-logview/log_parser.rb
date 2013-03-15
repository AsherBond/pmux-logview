require 'fileutils'
require 'date'
require 'yaml'

module Pmux
  module LogView
    class LogParser
      @@pmux_log_path = ".pmux/log"
      @@pmux_old_log_path = ".pmux/log/old"
      @@dispatcher_log = "dispatcher.log"
      @@max_dispatcher_log_size = 1024 * 64 # 128k

      @@document_re = Regexp.new("^---")
      @@header_re = Regexp.new("^:[a-z_]+:")
      @@header_params_re = Regexp.new("^  :[a-z_]+:")
      @@task_re = Regexp.new("  [a-z_]+:")
      @@futter_re = Regexp.new("^:[a-z_]+:")
      @@mapper_re = Regexp.new("^:mapper:")
      @@job_started_at_re = Regexp.new("^:job_started_at:")
      @@start_time_re = Regexp.new("^:start_time:")
      @@invoked_at_re = Regexp.new("^:invoked_at:")
      @@map_tasks_re = Regexp.new("^:map_tasks:")
      @@tasksize_re = Regexp.new("^:tasksize:")
      @@reduce_tasks_re = Regexp.new("^:reduce_tasks:")
      @@params_re = Regexp.new("^:params:")
      @@task_id_re = Regexp.new("^[0-9]+:")
      @@task_allocated_at_re = Regexp.new("^  allocated_at:")
      @@task_welapse_re = Regexp.new("^  welapse:")
      @@task_elapse_re = Regexp.new("^  elapse:")
      @@job_finished_at_re = Regexp.new("^:job_finished_at:")
      @@quote_re = Regexp.new("^['\"]|['\"]$")

      @logger = nil

      def initialize cache_dir_path
        @cache_dir_path = cache_dir_path
        @logger = LoggerWrapper.instance()
      end

      def get_files user, log_path
        return Dir.glob(File.expand_path(["~" + user, log_path, "*.yml"].join(File::SEPARATOR)))
      end

      def fast_parse file, job_id
        cachable = false
        job = {"end_time" => nil, "elapsed_time" => nil, "finished_tasks" => 0}
        job["job_id"] = job_id
        task_cnt = 0
        start_time = nil
        end_time = nil
        File.open(file) {|f|
          doc_cnt = 0
          f.each_line {|ln|
            if @@document_re =~ ln
              doc_cnt += 1
            elsif doc_cnt == 1 && (@@job_started_at_re =~ ln || @@start_time_re =~ ln)
              empty, key, value = ln.split(":", 3)
              start_time = DateTime::parse(value.strip())
              job["start_time_msec"] = start_time.strftime("%Q") 
              job["start_time"] = start_time.strftime("%Y-%m-%d %H:%M:%S")
            elsif doc_cnt == 1 && @@map_tasks_re =~ ln
              empty, key, value = ln.split(":", 3)
              job[key] = value.strip().to_i()
            elsif doc_cnt == 1 && @@mapper_re =~ ln
              empty, key, value = ln.split(":", 3)
              job[key] = value.strip()
            elsif doc_cnt == 2 && @@task_id_re =~ ln
              task_cnt += 1
            elsif doc_cnt == 3 && @@job_finished_at_re =~ ln
              empty, key, value = ln.split(":", 3)
              end_time = DateTime::parse(value.strip())
              job["end_time_msec"] = end_time.strftime("%Q") 
              job["end_time"] = end_time.strftime("%Y-%m-%d %H:%M:%S")
              cachable = true
            end
          }
        }
        job["finished_tasks"] = task_cnt
        job["elapsed_time"] = ((end_time - start_time) * 86400).to_f if !start_time.nil? && !end_time.nil?
        if end_time.nil?
          if job["map_tasks"].nil?
            job["end_time"] = "--- %"
          elsif job["map_tasks"] == 0 
            job["end_time"] = "100%"
          else
            job["end_time"] = ((100 * job["finished_tasks"]) / job["map_tasks"]).to_s + "%"
          end
        end
        return [job, cachable]
      end

      def load_cache file_path
        cache = {} 
        return cache if !File.exist?(file_path)
        begin
          File.open(file_path, "rb") {|f|
            f.flock(File::LOCK_SH)
            cache = Marshal.load(f)
            f.flock(File::LOCK_UN)
          }
          return cache
        rescue
          @logger.warn("cannot load cache file (#{file_path})")
          return cache
        end
      end

      def save_cache file_path, jobs, cachable_ids
        cache = {}
        for job_id in cachable_ids
            cache[job_id] = jobs[job_id]
        end
        FileUtils.mkdir_p(@cache_dir_path) if !File.exist?(@cache_dir_path)
        begin
          File.open(file_path, File::RDWR|File::CREAT, 0644) {|f|
            f.flock(File::LOCK_EX)
            f.rewind()
            Marshal.dump(cache, f)
            f.flush()
            f.truncate(f.pos)
            f.flock(File::LOCK_UN)
          }
        rescue
          @logger.warn("cannot save cache file (#{file_path})")
        end
      end
 
      def add_cache_ids cache_ids, jobs, job_id, job, sort_key, sort_order
        insert_idx = -1
        for idx in 0..(cache_ids.length - 1)
          id = cache_ids[idx] 
          if sort_order == "desc"
            case sort_key
            when "start_time"
              if job["start_time_msec"].to_i > jobs[id]["start_time_msec"].to_i
                insert_idx = idx
                break
              end
            when "job_id"
              if job["job_id"].to_i > jobs[id]["job_id"].to_i
                insert_idx = idx
                break
              end
            when "mapper"
              if job["mapper"] > jobs[id]["mapper"]
                insert_idx = idx
                break
              end
            when "end_time"
              if job["end_time_msec"].to_i > jobs[id]["end_time_msec"].to_i
                insert_idx = idx
                break
              end
            when "elapsed_time"
              if job["elapsed_time"].to_i > jobs[id]["elapsed_time"].to_i
                insert_idx = idx
                break
              end
            end
          elsif sort_order == "asc"
            case sort_key
            when "start_time"
              if job["start_time_msec"].to_i < jobs[id]["start_time_msec"].to_i
                insert_idx = idx
                break
              end
            when "job_id"
              if job["job_id"].to_i < jobs[id]["job_id"].to_i
                insert_idx = idx
                break
              end
            when "mapper"
              if job["mapper"] < jobs[id]["mapper"]
                insert_idx = idx
                break
              end
            when "end_time"
              if job["end_time_msec"].to_i < jobs[id]["end_time_msec"].to_i
                insert_idx = idx
                break
              end
            when "elapsed_time"
              if job["elapsed_time"].to_i < jobs[id]["elapsed_time"].to_i
                insert_idx = idx
                break
              end
            end
          end
        end
        if insert_idx != -1
          cache_ids.insert(insert_idx, job_id);
        else
          cache_ids.push(job_id)
        end
      end

      def parse_data_cache_ids parse_data, jobs, cache_ids, nitems, page 
        start_idx = nitems * page
        if start_idx >= (cache_ids.length - 1)
           return
        end
        for idx in start_idx..cache_ids.length - 1
          parse_data[cache_ids[idx]] = jobs[cache_ids[idx]]
          nitems -= 1
          if nitems == 0
            break
          end
        end
      end

      def parse_log_job user, data
        new_jobs_cookie = DateTime.now().strftime("%Q").to_i 
        jobs = {}
        new_cache_ids = []
        update_ids = []
        cache_file_path = [@cache_dir_path, user].join(File::SEPARATOR)
        cache = load_cache(cache_file_path)
        need_save_cache = false
	for log_path in [@@pmux_log_path]
          files = get_files(user, log_path)
          for file in files
            job_id = File::basename(file).sub(".yml", "")
            if cache.key?(job_id)
              jobs[job_id] = cache[job_id]
              add_cache_ids(new_cache_ids, jobs, job_id, cache[job_id], data["sort_key"], data["sort_order"])
              update_ids.push(job_id) if data["jobs_cookie"] > 0 && data["jobs_cookie"] <= cache[job_id]["end_time_msec"].to_i
              next
            else
              job, cachable = fast_parse(file, job_id)
              jobs[job_id] = job
              update_ids.push(job_id)
              if cachable
                add_cache_ids(new_cache_ids, jobs, job_id, job, data["sort_key"], data["sort_order"])
                need_save_cache = true
              end
            end
          end
        end
        save_cache(cache_file_path, jobs, new_cache_ids) if need_save_cache || cache.length != new_cache_ids.length
        parse_data = { "jobs" => {}, "jobs_cookie" => new_jobs_cookie}
        if data["type"] == "archive"
          parse_data_cache_ids(parse_data["jobs"], jobs, new_cache_ids, data["nitems"], data["page"])
        end
        for job_id in update_ids
          parse_data["jobs"][job_id] = jobs[job_id] if jobs.key?(job_id)
        end
        return parse_data
      end

      def full_parse file_path
        documents = []
        File.open(file_path) {|f|
          doc_cnt = 0
          new_doc = nil
          task_id = nil
          f.each_line {|ln|
            if @@document_re =~ ln
              if !new_doc.nil?
                new_doc.delete(task_id) if doc_cnt == 2 && !task_id.nil? && new_doc[task_id].length < 5
                documents.push(new_doc)
              end
              doc_cnt += 1
              new_doc = {}
              task_id = nil
            elsif doc_cnt == 1 && (@@job_started_at_re =~ ln || @@invoked_at_re =~ ln || @@start_time_re =~ ln)
              empty, key, value = ln.split(":", 3)
              time = DateTime::parse(value.strip())
              new_doc[key] = time
            elsif doc_cnt == 1 && (@@map_tasks_re =~ ln || @@tasksize_re =~ ln || @@reduce_tasks_re =~ ln)
              empty, key, value = ln.split(":", 3)
              new_doc[key] = value.strip().to_i()
            elsif doc_cnt == 1 && @@params_re =~ ln
              empty, key, value = ln.split(":", 3)
              new_doc["params"] = {}
            elsif doc_cnt == 1 && @@header_re =~ ln
              empty, key, value = ln.split(":", 3)
              new_doc[key] = value.strip().gsub(@@quote_re, "")
            elsif doc_cnt == 1 && @@header_params_re =~ ln
              empty, key, value = ln.split(":", 3)
              new_doc["params"][key] = value.strip().gsub(@@quote_re, "")
            elsif doc_cnt == 2 && @@task_id_re =~ ln
              task_id, empty = ln.split(":", 2)
              new_doc[task_id] = {}
            elsif doc_cnt == 2 && (@@task_allocated_at_re =~ ln || @@task_welapse_re =~ ln || @@task_elapse_re =~ ln)
              key, value = ln.split(":", 2)
              new_doc[task_id][key.strip()] = value.strip().to_f()
            elsif doc_cnt == 2 && @@task_re =~ ln
              key, value = ln.split(":", 2)
              new_doc[task_id][key.strip()] = value.strip().gsub(@@quote_re, "")
            elsif doc_cnt == 3 && @@job_finished_at_re =~ ln
              empty, key, value = ln.split(":", 3)
              time = DateTime::parse(value.strip())
              new_doc[key] = time
            elsif doc_cnt == 3 && @@futter_re =~ ln
              empty, key, value = ln.split(":", 3)
              new_doc[key] = value.strip().gsub(@@quote_re, "")
            end
          }
          if !new_doc.nil?
            new_doc.delete(task_id) if doc_cnt == 2 && new_doc[task_id].length < 5
            documents.push(new_doc)
          end
          if documents.length == 1
            documents.push(nil)
          end
          if documents.length == 2
            documents.push(nil)
          end
        }
        return documents
      end

      def parse_log_job_detail user, job_id
        file_path = File.expand_path(["~" + user, @@pmux_log_path, job_id + ".yml"].join(File::SEPARATOR))
        if !File.exist?(file_path)
          file_path = File.expand_path(["~" + user, @@pmux_old_log_path, job_id + ".yml"].join(File::SEPARATOR))
          if !File.exist?(file_path)
            return nil
          end
        end
        #begin
          #f = File.open(file_path)
          #docs = YAML::load_stream(f)
          docs = full_parse(file_path)
          parse_data = []
          for idx in [0, 1, 2]
            if idx == 0 && !docs[idx].nil?
              docs[idx]["job_started_at_msec"] = docs[idx]["job_started_at"].strftime("%Q") if !docs[idx]["job_started_at"].nil?
            elsif idx == 2 && !docs[idx].nil?
              docs[idx]["job_finished_at_msec"] = docs[idx]["job_finished_at"].strftime("%Q") if !docs[idx]["job_finished_at"].nil?
            end
            if docs[idx].nil?
                parse_data.push({})
            else
                parse_data.push(docs[idx])
            end
          end
        #ensure
        #  f.close() if !f.nil?
        #end
        return parse_data
      end

      def parse_log_dispatcher user
        parse_data = []
        file_path = File.expand_path(["~" + user, @@pmux_log_path, @@dispatcher_log].join(File::SEPARATOR))
        begin
          f = File.open(file_path)
          begin
            f.seek(-@@max_dispatcher_log_size, IO::SEEK_END)
          rescue
          end
          while ln = f.gets
              parse_data.push(ln)
          end
          partial_line = parse_data.shift()
        ensure
          f.close() if !f.nil?
        end
        return parse_data
      end

      def set_cache_dir_path cache_dir_path
        @cache_dir_path = cache_dir_path
      end
    end
  end
end
