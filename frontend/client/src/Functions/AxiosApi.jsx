import axios from 'axios';
import React, { useEffect, useState } from "react";


async function MakeApiRequest(method, url, headers, params,data) {
    try {
        const response = await axios({
            method: method,
            url: url,
            headers: headers,
            params: params,
            data: data
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export default MakeApiRequest;
