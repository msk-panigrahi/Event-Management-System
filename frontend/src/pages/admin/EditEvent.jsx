import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import { eventAPI } from '../../services/api';
import { EventForm } from './EventForm';

const EditEvent = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventAPI.getById(id)
      .then((res) => setEvent(res.data.data))
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!event) return <div className="page-wrapper container"><p>Event not found</p></div>;

  return <EventForm initial={event} isEdit />;
};

export default EditEvent;
