import apiClient from '../api/client'

/**
 * Create a new listing for a provider
 */
export const createListing = async (providerId, formData) => {
    if (!providerId) {
        throw new Error('providerId is required to create a listing')
    }

    const numericProviderId = Number(providerId)

    if (Number.isNaN(numericProviderId)) {
        throw new Error('providerId must be a valid number')
    }

    const response = await apiClient.post(
        `/provider/${numericProviderId}/listings`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    )

    return response.data
}

/**
 * Update an existing listing
 */
export const updateListing = async (listingId, formData) => {
    if (!listingId) {
        throw new Error('listingId is required to update a listing')
    }

    const numericListingId = Number(listingId)

    if (Number.isNaN(numericListingId)) {
        throw new Error('listingId must be a valid number')
    }

    const response = await apiClient.put(
        `/provider/listings/${numericListingId}`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    )

    return response.data
}

/**
 * Delete a listing
 */
export const deleteListing = async (listingId) => {
    if (!listingId) {
        throw new Error('listingId is required to delete a listing')
    }

    const numericListingId = Number(listingId)

    if (Number.isNaN(numericListingId)) {
        throw new Error('listingId must be a valid number')
    }

    const response = await apiClient.delete(
        `/provider/listings/${numericListingId}`
    )

    return response.data
}

/**
 * Get all listings for a provider
 */
export const getProviderListings = async (providerId) => {
    if (!providerId) {
        throw new Error('providerId is required to fetch provider listings')
    }

    const numericProviderId = Number(providerId)

    if (Number.isNaN(numericProviderId)) {
        throw new Error('providerId must be a valid number')
    }

    const response = await apiClient.get(
        `/provider/${numericProviderId}/listings`
    )

    return response.data
}

export const getListingById = async (listingId) => {
    console.log("getListingById called with listingId:", listingId);
    if (!listingId) {
        throw new Error('listingId is required to fetch provider listings')
    }

    const numericlistingId = Number(listingId)
    console.log("Fetching listing with ID:", numericlistingId);
    if (Number.isNaN(numericlistingId)) {
        throw new Error('providerId must be a valid number')
    } 
    const response = await apiClient.get(
        `/provider/${numericlistingId}/listing`
    )

    return response.data
}
