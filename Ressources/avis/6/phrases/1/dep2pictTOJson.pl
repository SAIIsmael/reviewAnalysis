#!/usr/bin/env perl

use strict;

system("clear");
die ("Pas assez de paramètres") if (@ARGV < 1) ;

open F, $ARGV[0]  or die ("Fichier inaccessible\n");
open R, ">$ARGV[0].json";

print R "{\"nodes\":[";
my @lignes = <F>;

my $premier = 1;
for my $ligne (@lignes) {
    if ($ligne =~ /(\d+){word="(.+)"; subword="([^#_,.:].+)#(.+)"/) {
       if ($premier) {$premier = 0;} else { print R ", "; }
       #print "$1 $2 $3 $4\n";
       print R "{\"id\":$1, \"word\": \"$2\", \"lemma\": \"$3\", \"nature\": \"$4\"}";  
    }
}
print R "],\n";

print R "\"edges\": [";
$premier = 1;
for my $ligne (@lignes) {
    if ($ligne =~ /(\d+) -> .*?(\d+){.+label="(.*?)"/) {
        if ($premier) {$premier = 0;} else { print R ", "; }
	#print "$1 $2 $3\n";
	print R "{\"source\":$1, \"target\":$2, \"label\":\"$3\"}";
    }
}
print R "]";

print R "}";

close F;
close R;

