/**
 *
 * @module "GTFS_Toolkit.WrapperAPI"
 *
 * see https://developers.google.com/transit/gtfs/reference
 */


'use strict';

var _ = require('lodash');


var theAPI = {

    /**
     * PrimaryKeys are built as follows:
     *      trip_id + '|' + direction + '|' + trip start time
     */
    //getPrimaryKeyForTrip : function (tripKey) {
        //var trip_id = this.getFullTripIDForTrip(tripKey),
            //direction_id = this.getDirectionIDForTrip(tripKey),
            //startTime;
        
        //if ( ! this.tripIsAScheduledTrip(tripKey) ) {
            //return null;
        //}  
    //},

    tripIsAScheduledTrip : function (tripKey) {
        return !!_.get(this, ['indexedScheduleData', 'trips', tripKey], null);
    },

    tripsHasSpatialData : function (tripKey) {
        var i = _.get(this, ['indexedSpatialData', 'tripKeyToProjectionsTableIndex', tripKey], NaN);

        return !isNaN(i);
    },

    getAllAgencyIDs : function () {
        var agency_data = this && this.indexedScheduleData && this.indexedScheduleData.agency;

        if ( (agency_data === null) || (typeof agency_data !== 'object') ) { return []; }

        return Object.keys(agency_data);
    },

    getNumberOfAgenciesInFeed : function () {
        return this.getAllAgencyIDs().length;
    },

    getAgencyTimezone : function (agency_id) {
        var agency_data = this && this.indexedScheduleData && this.indexedScheduleData.agency,
            agency0,
            row;

        if ( (agency_data === null) || (typeof agency_data !== 'object') ) { return null; }

        row = agency_data[agency_id];

        if (!row) {
            agency0 = Object.keys(agency_data)[0];
            row = agency_data[agency0];
        }

        return (row && row.agency_timezone) ? row.agency_timezone : null; 
    },

    getAgencyIDForTrip : function (tripKey) {
        var tripRouteID,
            tripAgencyID;

        tripRouteID  = _.get(this, ['indexedScheduleData', 'trips', tripKey, 'route_id'], null);
        tripAgencyID = _.get(this, ['indexedScheduleData', 'routes', tripRouteID, 'agency_id'], null);
        
        if (tripAgencyID !== null) {
            return tripAgencyID; 
        } else if ((tripAgencyID === null) && (this.getNumberOfAgenciesInFeed() === 1)) {
            return this.getAllAgencyIDs()[0];
        } else {
            return null;
        }
    },

    /**
     * "If the a tripKeyMutator function was passed to the indexers, 
     *  tripKey is the output of that function when passed a trip_id.
     *  This function performs the inverse, mapping back from tripKey
     *  to trip_id."
     * @param {string} tripKey - The key used in the indices to represent a trip.
     * @returns {string}
     */ 
    getFullTripIDForTrip : function (tripKey) {
        return _.get(this, ['indexedScheduleData', 'trips', tripKey, 'trip_id'], null);
    },


    /**
     * "The trip_headsign field contains the text that appears on a sign 
     *  that identifies the trip's destination to passengers."
     * @param {string} tripKey - either trip_id or output of tripKeyMutator
     * @returns {string}
     */
    getTripHeadsign : function (tripKey) {
        return _.get(this, ['indexedScheduleData', 'trips', tripKey, 'trip_headsign'], null);
    },



    /**
     * "The shape_id field contains an ID that defines a shape for the trip. 
     *  This value is referenced from the shapes.txt file. 
     *  The shapes.txt file allows you to define how a line 
     *  should be drawn on the map to represent a trip.
     * @param {string} tripKey - either trip_id or output of tripKeyMutator
     * @return {string}
     */
    getShapeIDForTrip : function (tripKey) {
        return _.get(this, ['indexedScheduleData', 'trips', tripKey, 'shape_id'], null);
    },



    getAllRoutes : function () {
        var routesIndex = _.get(this, ['indexedScheduleData', 'routes'], null);

        return routesIndex && Object.keys(routesIndex) ;
    } ,

    /**
     * "The route_id field contains an ID that uniquely identifies a route. 
     *  This value is referenced from the routes.txt file."
     * @param {string} tripKey - either trip_id or output of tripKeyMutator
     * @return {string}
     */
    getRouteIDForTrip : function (tripKey) {
        return _.get(this, ['indexedScheduleData', 'trips', tripKey, 'route_id'], null);
    },

    /**
     * "The direction_id field contains a binary value that indicates 
     *  the direction of travel for a trip. Use this field to distinguish 
     *  between bi-directional trips with the same route_id. 
     *  This field is not used in routing; it provides a way to separate 
     *  trips by direction when publishing time tables"
     * @param {string} tripKey - either trip_id or output of tripKeyMutator
     * @return {string}
     */
    getDirectionIDForTrip : function (tripKey) {
        var direction_id = _.get(this, ['indexedScheduleData', 'trips', tripKey, 'direction_id'], null);

        return ((direction_id !== null) && (direction_id.toString)) ? direction_id.toString() : direction_id;
    },

    /**
     * "The route_short_name contains the short name of a route. 
     *  This will often be a short, abstract identifier 
     *  like "32", "100X", or "Green" that riders use to identify a route, 
     *  but which doesn't give any indication of what places the route serves."
     * @param {string} route_id 
     * @return {string}
     */
    getRouteShortName : function (route_id) {
        var routeShortName = _.get(this, ['indexedScheduleData', 'routes', route_id, 'route_short_name'], null);

        return ((routeShortName !== null) && (routeShortName.toString)) ? routeShortName.toString() : routeShortName;
    },



    /**
     * "The route_long_name contains the full name of a route. 
     *  This name is generally more descriptive than the route_short_name 
     *  and will often include the route's destination or stop."
     * @param {string} route_id
     * @return {string}
     */
    getRouteLongName : function (route_id) {
        return _.get(this, ['indexedScheduleData', 'routes', route_id, 'route_long_name'], null);
    },


    routeExists : function (route_id) {
        var routeData = _.get(this, ['indexedScheduleData', 'routes', route_id], null);
    
        return (routeData !== null);
    },


    getAllStops : function () {
        var stopsIndex = _.get(this, ['indexedScheduleData', 'stops'], null);

        return stopsIndex && Object.keys(stopsIndex) ;
    } ,

    stopExists : function (stop_id) {
        var stopData = _.get(this, ['indexedScheduleData', 'stops', stop_id], null);

        return (stopData !== null);
    }, 
    
    /**
     * "The stop_name field contains the name of a stop or station."
     * @param {string} stop_id
     * @returns {string}
     */
    getStopName : function (stop_id) {
        return _.get(this, ['indexedScheduleData', 'stops', stop_id, 'stop_name'], null);
    },


    getOriginStopIdForTrip : function (tripKey) {
        var i  = _.get(this, ['indexedSpatialData', 'tripKeyToProjectionsTableIndex', tripKey], null),
            id = _.get(this, ['indexedSpatialData', 'stopProjectionsTable', i, '__originStopID'], null);

        if ((id !== null) && (id.toString)) { 
            id = id.toString();
        }

        return id;
    },

    getDestinationStopIdForTrip : function (tripKey) {
        var i  = _.get(this, ['indexedSpatialData', 'tripKeyToProjectionsTableIndex', tripKey], null),
            id = _.get(this, ['indexedSpatialData', 'stopProjectionsTable', i, '__destinationStopID'], null);

        if ((id !== null) && (id.toString)) { 
            id = id.toString();
        }

        return id;
    },


    getOriginDepartureTimestampForTrip : function (tripKey) {

        // Stop sequence numbers are unreliable, thus the dirty data handling in this function. 
        
        var originStopId = this.getOriginStopIdForTrip(tripKey) ,

            stopIdToSequenceNumbersTable ,
            originStopSequenceNumber ,
            stopInfoBySequenceNumber ,
            stopInfo ;

        stopIdToSequenceNumbersTable = (originStopId !== null) ? 
            _.get(this, ['indexedScheduleData','stop_times', tripKey,'stopInfoBySequenceNumber', originStopId],null) :
            null;

        originStopSequenceNumber = 
            (Array.isArray(stopIdToSequenceNumbersTable)) ? parseInt(stopIdToSequenceNumbersTable[0]) : NaN;

        if (!isNaN(originStopSequenceNumber)) { return; }

        stopInfoBySequenceNumber = 
            _.get(this, ['indexedScheduleData', 'stop_times', tripKey, 'stopInfoBySequenceNumber'], null) ;

        stopInfo = stopInfoBySequenceNumber ? stopInfoBySequenceNumber[originStopSequenceNumber] : null;

        return (stopInfo && stopInfo.departure_time) || null;
    },


    // tripKey and stop_id are required. stop_sequence is optional.
    // Returns an object with the arrival and the departure time for the trip for the stop.
    getStopInfoBySequenceNumberForStopForTrip : function (tripKey, stop_id, stop_sequence)  {

        var stopInfoBySequenceNumber = 
                _.get(this, ['indexedScheduleData', 'stop_times', tripKey, 'stopInfoBySequenceNumber'], null) ,
            stopIdToSequenceNumbersTable ,
            stopSequenceNumbers ,
            stopInfo ;

        if ((stopInfoBySequenceNumber === null) || (typeof stopInfoBySequenceNumber !== 'object')) {
            return null;
        }

        stop_sequence = parseInt(stop_sequence);

        if (isNaN(stop_sequence)) { // If stop_sequence was not specified 

            // We first get the stopIdToSequenceNumbersTable 
            stopIdToSequenceNumbersTable = 
                _.get(this, ['indexedScheduleData', 'stop_times', tripKey, 'stopIdToSequenceNumbersTable'], null);


            // Then we get the the list of sequence numbers for the stop along the trip.
            stopSequenceNumbers = (stopIdToSequenceNumbersTable !== null) ? 
                                    stopIdToSequenceNumbersTable[stop_id] : null;

            // Now we take the first stop sequence number from the list.
            if (Array.isArray(stopSequenceNumbers) && stopSequenceNumbers.length) {
                stop_sequence = parseInt(stopSequenceNumbers[0]);
            } else {
                stop_sequence = NaN;
            }
        }

        stopInfo = (!isNaN(stop_sequence) && stopInfoBySequenceNumber[stop_sequence]);

        return (stopInfo || null);
    },


    getScheduledArrivalTimeForStopForTrip : function (tripKey, stop_id, stop_sequence)  {
        var stopInfo = this.getStopInfoBySequenceNumberForStopForTrip(tripKey, stop_id, stop_sequence) ;
            
        return (stopInfo && stopInfo.arrival_time) || null;
    },


    getScheduledDepartureTimeForStopForTrip : function (tripKey, stop_id, stop_sequence)  {
        var stopInfo = this.getStopInfoBySequenceNumberForStopForTrip(tripKey, stop_id, stop_sequence) ;
            
        return (stopInfo && stopInfo.departure_time) || null;
    },

    
    getStopInfoBySequenceNumberForTrip : function (tripKey, stop_sequence) {
        return  _.get(this, 
                      ['indexedScheduleData', 'stop_times', tripKey, 'stopInfoBySequenceNumber', stop_sequence], 
                      null);
    },


    getSubsequentStopInfoForTrip : function (tripKey, stop_sequence)  {
        var stopInfo = _.get(this, 
                             ['indexedScheduleData', 'stop_times', tripKey, 'stopInfoBySequenceNumber', stop_sequence],
                             null) ;

        return (stopInfo && stopInfo.nextStop) || null;
    },

    getSubsequentStopIdForTrip : function (tripKey, stop_sequence)  {
        var subsequentStopInfo = this.getSubsequentStopInfoForTrip(tripKey, stop_sequence) ;

        return (subsequentStopInfo) ? subsequentStopInfo.stop_id : null;
    },

    getStopDistanceAlongRouteForTripInKilometers : function (tripKey, stop_id) {
        var i = _.get(this, ['indexedSpatialData', 'tripKeyToProjectionsTableIndex', tripKey], null) ;

        return _.get(this, ['indexedSpatialData', 'stopProjectionsTable', i, stop_id, 'snapped_dist_along_km'], null) ;
    },

    getStopDistanceAlongRouteForTripInMeters : function (tripKey, stop_id) {
        var d = parseFloat(this.getStopDistanceAlongRouteForTripInKilometers(tripKey, stop_id));

        return (!isNaN(d)) ? (d * 1000) : null;
    },

    getShapeSegmentNumberOfStopForTrip : function (tripKey, stop_id) {
        var i        = _.get(this, ['indexedSpatialData', 'tripKeyToProjectionsTableIndex', tripKey], null) ;

        return _.get(this, ['indexedSpatialData', 'stopProjectionsTable', i, stop_id, 'segmentNum'], null);
    },

    getSnappedCoordinatesOfStopForTrip : function (tripKey, stop_id) {
        var i = _.get(this, ['indexedSpatialData', 'tripKeyToProjectionsTableIndex', tripKey], null); 

        return _.get(this, ['indexedSpatialData', 'stopProjectionsTable', i, stop_id, 'snapped_coords'], null);
    },

    // Wrapper around Array.slice:
    //      startStop and endStop have the same meaning as start and end in Array.slice.
    getSliceShapeForTrip : function (tripKey, start, end) {
        var i       = _.get(this, ['indexedSpatialData', 'tripKeyToProjectionsTableIndex', tripKey], null) ,
            shapeID = _.get(this, ['indexedSpatialData', 'stopProjectionsTable', i, '__shapeID'], null)    ,
            shape   = _.get(this, ['indexedSpatialData', 'shapes', shapeID], null) ;

        if (Array.isArray(shape)) {
            return shape.slice(start, end);
        } else {
            return null;
        }
    },

    getPreviousStopIDOfStopForTrip : function (tripKey, stop_id) {
        var i = _.get(this, ['indexedSpatialData', 'tripKeyToProjectionsTableIndex', tripKey], null); 

        return _.get(this, ['indexedSpatialData', 'stopProjectionsTable', i, stop_id, 'previous_stop_id'], null);
    },


    getSequenceNumbersForStopForTrip : function (tripKey, stop_id) {
        var seqNumbers = 
            _.get(this, ['indexedScheduleData', 'stop_times', tripKey, 'stopIdToSequenceNumbersTable', stop_id], null);

        return (Array.isArray(seqNumbers)) ? seqNumbers : null;
    },

    /**
     * "The block_id field identifies the block to which the trip belongs. 
     *  A block consists of two or more sequential trips made using the same vehicle, 
     *  where a passenger can transfer from one trip to the next just by staying in the vehicle. 
     *  The block_id must be referenced by two or more trips in trips.txt."
     *
     * NOTE: Qualifications in the MTA documentations.
     *       @see [Transparency of Block vs. Trip-Level Assignment]@link{https://bustime.mta.info/wiki/Developers/SIRIMonitoredVehicleJourney#HTransparencyofBlockvs.Trip-LevelAssignment}
     * @param {string|number} tripKey
     * @returns {string}
     */
    getBlockIDForTrip : function (tripKey) {
        return _.get(this, ['indexedScheduleData', 'trips', tripKey, 'block_id']) || null;
    }
};



module.exports = theAPI;

