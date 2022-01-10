import React from 'react';
import {requestStatus} from "../constants";
import Badge from "./Badge";

const RelationshipStatusBadge = (props) => {
        const {relationship, requesterIsSelf} = props
        if (relationship === null || relationship.status === requestStatus.REJECTED || relationship.status === requestStatus.DELETED) {
            return null
        } else if (relationship.status === requestStatus.REQUESTED) {
            if (requesterIsSelf) {
                return <Badge type="neutral">waiting</Badge>
            }
            else {
                return <Badge type="warning">pending</Badge>
            }
        } else if (relationship.status === requestStatus.ACCEPTED) {
            return <Badge type="success">connected</Badge>
        } else if (relationship.status === requestStatus.BLOCKED) {
            return <Badge type="danger">blocked</Badge>
        }
};

export default RelationshipStatusBadge;