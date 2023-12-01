/**
 * @fileoverview
 * Provides methods for the Journey UI and interaction with the Journey API.
 */

import { pageUtils } from '../../../shared/pageUtils.js';

// reset UI to start journey
export function resetUI() {
    pageUtils.hide('journey_start');
    pageUtils.hide('journey_complete_announce');
    pageUtils.hide('action_response_error');
    setJourneyId();
}

// get journey id from page
// save journey id in local storage
export function getJourneyId() {
    try {
        const journeyIdField = document.querySelector('#journey_id');
        if (!(journeyIdField && journeyIdField.value)) {
            throw new Error('Journey Id is empty');
        }
        // save journey id in local storage
        localStorage.setItem('journeyId', journeyIdField.value);
        return journeyIdField.value;
    } catch (error) {
        handleError(error);
    }
}

export function setJourneyId() {
    // fetch journey id from local storage
    const journeyId = localStorage.getItem('journeyId');
    if (journeyId) {
        pageUtils.updateElementText('journey_id', journeyId);
    }
}

// Handle journey success
export function handleJourneySuccess(idoResponse) {
    console.debug(`handle journey success`);
    pageUtils.hide('action_response_error');
    pageUtils.show('journey_complete_announce');
    pageUtils.show('journey_start');
    pageUtils.hideLoading();
}

// Handle journey error
export function handleError(error) {
    console.error(`Journey exited: ${error}`);
    pageUtils.updateElementText('action_response_error', error);
    pageUtils.show('action_response_error');
    pageUtils.hide('journey_complete_announce');
    pageUtils.show('journey_start');
    pageUtils.hideLoading();
}

// setup UI for the first time
setJourneyId();