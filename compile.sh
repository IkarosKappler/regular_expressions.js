#!/bin/bash
#
# This script 'compiles' the javascript files and packs them into one single file.
#
#
# Version >= 1.0.1 requires yui-compressor to be installed.
# Install with
#  apt-get install yui-compressor
#
#
# @author   Ikaros Kappler
# @date     2015-05-27
# @modified 2015-07-08
# @version  1.0.1


_RED='\033[0;31m'
_GREEN='\033[0;32m'
_PURPLE='\033[0;35m'
_NC='\033[0m'

echo -e "${_PURPLE}This is the compiler script that packs the javascript source files into one package.${_NC}"
if [ $# -lt 2 ]; then
    echo -e "[${_RED}Error${_NC}] Please pass: <filelist_file> <output_file>";
    echo -e "        To generate a new filelist file, type mkfilelist > filelist.txt";
    echo -e "        Example: ${_GREEN}compile.sh filelist.txt compiled.js${_NC}"
    echo -e "        "
    exit 1;
fi

filelist=$1;            # "files.txt";
outfile=$2;             # "compiled.js";
files=();

delimpos=`expr index "$outfile" .`
# echo "delimpos="$delimpos
outfile_name=`echo "$outfile" | cut -d'.' -f1`
outfile_extension=`echo "$outfile" | cut -d'.' -f2`
# File has extension?
if [ $delimpos == 0 ]; then
    outfile_extension=""
fi


# echo "outfile_name=$outfile_name"
# echo "outfile_extension=$outfile_extension"

line_no=1
while read line
do
    
    # Trim line:
    var="${line#"${line%%[![:space:]]*}"}"   # remove leading whitespace characters
    var="${line%"${line##*[![:space:]]}"}"   # remove trailing whitespace characters

    # Check if line is not empty
    if [ ! -z "$line" -a "$line"!=" " ]; then

	# Check if line is no comment (beginning with ';')
	if [[ ${line:0:1} != ';' ]]; then

	    # Check if file exists
	    if [ ! -f "$line" ]; then
		echo "Error: file $line not found."
		exit 1
	    elif [[ "$line" =~ ' ' ]]; then   # Check if line contains whitespace
		files+=("\"$line\"")
	    else
		files+=($line);
	    fi
	fi
	
    fi
    line_no=`expr $line_no + 1`;
done < $filelist

#tmp="$(echo ${files[*]})";
cmd="cat $(echo ${files[*]})";
echo "Executing: $cmd"

result=$($cmd)
ec="$?"
if [ "$ec" -ne "0" ]; then
    echo -e "[${_RED}Error${_NC}] Failed. Exit code $ec"
    exit 1
else
    echo "Printing output to file ... ";
    # To preserve newlines the var must be quoted.
    echo "$result" > $outfile
    # echo -e "$result"
    #
    
    outfile_minimized="$outfile_name.min.$outfile_extension"
    echo "Printing minimized file to $outfile_minimized ..."
    result=$(yui-compressor "$outfile" -o "$outfile_minimized")
    ec="$?"
    if [ "$ec" -ne "0" ]; then
	echo -e "[${_RED}Error${_NC}] Failed. Exit code $ec"
	exit 1
    else
	echo -e "${_GREEN}Done.${_NC}"
    fi
fi

