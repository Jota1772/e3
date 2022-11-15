#!/usr/bin/perl 

package webutil;

use HTML::Entities;

sub new {
	my ($class) = @_;
	my $self = {};
	bless $self, $class;
	return $self;
}

sub error {
	 my ($self, $title, $help) = @_;
	 print "Content-type: text/html; charset=UTF-8\n\n";
	 print "<!DOCTYPE html>\n";
	 print "<html>\n";
	 print "<head>\n";
	 print "<meta charset=UTF-8>\n";
	 print "<title>".encode_entities($title)."</title>\n";
	 print "</head>\n";
	 print "<body>\n";
	 print "<h1 style=color:red>".encode_entities($title)."</h1>\n";
	 print "<pre>".encode_entities($help||"")."</pre>\n";
	 print "</body>\n";
	 print "</html>\n";
	 exit 0;
}

sub redirect {
	 my ($self, $url) = @_;
	 $url = "http".($ENV{'HTTPS'}?"s":"")."://".$ENV{'SERVER_NAME'}.($ENV{'SERVER_PORT'}=~/^80|443$/?"":":".$ENV{'SERVER_PORT'}).$url if ($url =~ /^\//);
	 print "Location: $url\n\n";
	 exit 0;
}

1;