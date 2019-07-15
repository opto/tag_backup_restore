# tag_backup_restore
Backup stores info of emails tags and email folders to a file on the desktop. This file can be used to restore the tags to another 
instance of Thunderbird.

Attention: the file is not encrypted, other users of the PC may see which emails you have tagged.

Restore checks that in destination-TB, equal or more tags are defined than in source-TB. It does not check
names or colours of the tags.

Only those tags are applied to destination TB, where the corresponding email can be found. For this to work, 
folderURIs must be identical in both installations.

Use at your own risk or test in a test-profile.
