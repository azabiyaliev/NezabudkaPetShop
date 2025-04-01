import FormEditPhoto from './FormEditPhoto.tsx';
import { useParams } from 'react-router-dom';

const Photo = () => {
  const { id } = useParams();
  return (
    <div>
      <FormEditPhoto photoId={Number(id)}/>
    </div>
  );
};

export default Photo;