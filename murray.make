; what is the difference between make and build ? in the cossey / buildkit example 
; `build` gets drupal core and patches it ( `distro` ) then retrieves the profile 
; and `make` gets contrib modules ( via buildkits drupal-org.make file ) and 
; additions from cossey
; removing later patches works but
; only addthis, colorbox and ctools are actually installed
; and only if --no-core is used .

; so build would run first
; followed by make

; ---------------------
; Include monograph install profile makefile via URL
; includes[] = https://raw.github.com/queenvictoria/monograph/master/monograph.make

api = 2
core = 7.x

; utils
projects[nice_menus][subdir] = "contrib"