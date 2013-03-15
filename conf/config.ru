require 'pmux-logview'

configure do
  # something
end

Pmux::LogView::Controller.setup({ "default_user" => "pmux",
                                  "use_basic_auth" =>  true,
                                  "password_file_path" =>  "/etc/pmux-logview/password",
                                  "cache_dir_path" => "/var/tmp/pmux-logview",
                                  "log_dir_path" => "/var/log/pmux-logview",
                                  "log_level" => "info",
                                  "use_syslog" => true,
                                  "syslog_facility" => "user" })
run Pmux::LogView::Controller
