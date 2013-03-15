# Pmux::Logview

pmux log viwer

## Requirements

  * ruby
  * pmux
  * gflocator
  * sinatra
  * json

## Installation

### Install dependency programs

  gem install gflocator
  gem install pmux
  gem install sinatra
  gem install json

### Install pmux-logview

  $ gem install pmux-logview

## Usage

  pmux-logview [options]
  -c, --config [config_file_path]
  -F, --foreground


## configuration

### Stand alone
  * pmux-logview configuration (default path = /etc/pmux-logview/pmux-logview.conf)
     * yaml format file

  ---
  host: 0.0.0.0
  port: 80
  default_user: "pmux"
  use_basic_auth: true
  password_file_path: "/etc/pmux-logview/password"
  cache_dir_path: "/var/tmp/pmux-logview"
  log_dir_path: "/var/log/pmux-logview"
  log_level: "info"
  use_syslog: false
  syslog_facility: "user"

  * basic auth configuration (default path = /etc/pmux-logview/password)
     * yaml format file

  ---
  user1:
      pass: pass1
  user2:
      pass: pass2

### Rack appliction
  * config.ru

  ---
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

## Package createting

  * create gem
  $ make

  * install
  # make install
    or
  # gem install pkg//pmux-logview-*.gem

  * create rpm
  $ make rpmbuild

  * install rpm
  $ rpm -ivh rpm/RPMS/noarch/rubygems-pmux-logview-*.noarch.rpm

## Behaiver
    - search log file in home directory of pmux user
    - save cache file in cache directory path
