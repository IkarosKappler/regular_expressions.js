#!/bin/bash
#
# This script cleans up the file strucure.
#
# @author   Henning Diesenberg
# @date     2015-07-15
# @version  1.0.0


# Remove all emacs backup files (files ending with ~).
find . -name '*~' -delete

