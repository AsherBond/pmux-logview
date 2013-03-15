# Generated from pkg/pmux-logview-0.2.0.gem by gem2rpm -*- rpm-spec -*-
%if %{_ruby_verid} == "default"
%define ruby_verid ""
%else
%define ruby_verid %{_ruby_verid}
%endif
%define rbname pmux-logview
%define version 0.2.2
%define release 1

Summary: Pmux log viewer
Name: rubygem%(echo -n %{ruby_verid})-%{rbname}

Version: %{version}
Release: %{release}
Group: Development/Ruby
License: Distributable
URL: https://github.com/iij/pmux-logview
Source0: %{rbname}-%{version}.gem
Source1: %{rbname}
BuildRoot: %{_tmppath}/%{name}-%{version}-root
Requires: ruby
Requires: rubygem%(echo -n %{ruby_verid})-pmux
Requires: rubygem%(echo -n %{ruby_verid})-gflocator 
Requires: rubygem%(echo -n %{ruby_verid})-json >= 1.6.1
Requires: rubygem%(echo -n %{ruby_verid})-sinatra >= 0.3.4
BuildRequires: ruby
BuildArch: noarch
Provides: ruby(Pmux-logview) = %{version}

%define gemdir %(ruby%{ruby_verid} -rubygems -e 'puts Gem::dir' 2>/dev/null)
%define gembuilddir %{buildroot}%{gemdir}

%description
Pmux log viewer

%prep
%setup -T -c

%build

%install
%{__rm} -rf %{buildroot}
mkdir -p %{gembuilddir}
gem%{ruby_verid} install --local --install-dir %{gembuilddir} --force %{SOURCE0}
mkdir -p %{buildroot}/%{_bindir}
mv %{gembuilddir}/bin/* %{buildroot}/%{_bindir}
rmdir %{gembuilddir}/bin
mkdir -p %{buildroot}/etc/init.d
cp %{SOURCE1} %{buildroot}/etc/init.d/

%clean
%{__rm} -rf %{buildroot}

%files
%defattr(-, root, root)
%{_bindir}/pmux-logview
%{gemdir}/gems/%{rbname}-%{version}/
%attr(0755,root,root) /etc/init.d/%{rbname}

%doc %{gemdir}/doc/%{rbname}-%{version}
%{gemdir}/cache/%{rbname}-%{version}.gem
%{gemdir}/specifications/%{rbname}-%{version}.gemspec

%changelog
