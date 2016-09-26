#!/bin/bash

# this script is autogenerated by 'ant startscripts'
# it starts a LAS2peer node providing the service 'i5.las2peer.services.gamificationBadgeService.GamificationBadgeService' of this project
# pls execute it from the root folder of your deployment, e. g. ./bin/start_network.sh

java -cp "lib/*" i5.las2peer.tools.L2pNodeLauncher -p 9014 -b gaudi.informatik.rwth-aachen.de:9011 uploadStartupDirectory\(\'etc/startup\'\) \
startService\(\'i5.las2peer.services.gamificationBadgeService.GamificationBadgeService@0.1\',\'gamificationbadgepass\'\) startWebConnector interactive
