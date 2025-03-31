import { useAppSelector, useAppDispatch } from '../../../app/hooks.ts';
import { selectPhotoCarousel, updatePhotoOrder } from '../../../store/photoCarousel/photoCarouselSlice.ts';
import { apiUrl } from '../../../globalConstants.ts';
import { Typography, Button } from '@mui/material';
import { DragEvent, useState, useEffect } from 'react';
import { PhotoCarousel } from '../../../types';
import { NavLink, useNavigate } from 'react-router-dom';
import { fetchPhoto, updatePhotoOrders , deletePhoto} from '../../../store/photoCarousel/photoCarouselThunk.ts';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from "sweetalert2";
import ModalWindowAddNewPhoto from '../../UI/ModalWindow/ModalWindowAddNewPhoto.tsx';
import { toast, ToastContainer } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const DragAndDropPhoto = () => {
  const photos = useAppSelector(selectPhotoCarousel) || [];
  const isLoading = useAppSelector((state) => state.photo_carousel.isLoading);
  const dispatch = useAppDispatch();
  const [currentPhoto, setCurrentPhoto] = useState<PhotoCarousel | null>(null);
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPhoto());
  }, [dispatch]);

  useEffect(() => {
    console.log('Текущие фото:', photos);
  }, [photos]);

  const dragStart = (e: DragEvent<HTMLDivElement>, image: PhotoCarousel) => {
    if (image.id !== undefined) {
      setCurrentPhoto(image);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("image", JSON.stringify(image));
    }
  };

  const dragEnd = (e: DragEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    target.style.backgroundColor = "lightgray";
  };

  const dragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    target.style.backgroundColor = "#f0f0f0";
  };

  const drop = (e: DragEvent<HTMLDivElement>, targetImage: PhotoCarousel) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (currentPhoto && targetImage.id !== currentPhoto.id) {
      const updatedPhotos = [...photos];
      const currentIndex = updatedPhotos.findIndex((photo) => photo.id === currentPhoto.id);
      const targetIndex = updatedPhotos.findIndex((photo) => photo.id === targetImage.id);

      [updatedPhotos[currentIndex], updatedPhotos[targetIndex]] = [updatedPhotos[targetIndex], updatedPhotos[currentIndex]];

      dispatch(updatePhotoOrder(updatedPhotos));
    }

    target.style.backgroundColor = "lightgray";
  };

  const handleSave = async () => {
    const updatedPhotos = photos
      .map((photo, index) => ({
        id: photo.id,
        order: index,
        photo: photo.photo,
        link: photo.link,
      }))
      .filter(photo => photo.id !== undefined);

    console.log("Отправляем обновлённые данные:", updatedPhotos);

    try {
      await dispatch(updatePhotoOrders(updatedPhotos)).unwrap();
      navigate('/');
      toast.success("Вы успешно изменили порядок фото в карусели;)");
    } catch (error) {
      console.error("Ошибка обновления:", error);
    }
  };

  const handleDeleteClick = async (photoId: number | undefined) => {
    if (photoId !== undefined) {
      const result = await Swal.fire({
        title: "Удалить фото?",
        text: "Вы уверены, что хотите удалить эту фотографию?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Удалить",
        cancelButtonText: "Отмена"
      });

      if (result.isConfirmed) {
        try {
          await dispatch(deletePhoto({ id: photoId })).unwrap();
          Swal.fire("Удалено!", "Фотография успешно удалена.", "success");
          await dispatch(fetchPhoto()).unwrap();
        } catch (error) {
          console.error("Ошибка удаления:", error);
          Swal.fire("Ошибка", "Не удалось удалить фотографию.", "error");
        }
      }
    } else {
      console.error("Invalid photo ID");
    }
  };

  return (
    <>
      <Typography
        component="h1"
        variant="h4"
        sx={{ color: "black", textAlign: "center", marginTop:"30px" }}
      >
        Редактирование карусели
      </Typography>
      <hr/>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          marginTop: "40px",
        }}
      >
        {isLoading ? (
          <div>Загрузка...</div>
        ) : Array.isArray(photos) ? (
          photos.map((image, index) => (
            <div
              key={image.id}
              style={{
                width: "400px",
                height: "200px",
                overflow: "hidden",
                borderRadius: "8px",
                border: "1px solid #ccc",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "grab",
                position: "relative",
              }}
              draggable={true}
              onDragStart={(e) => dragStart(e, image)}
              onDragEnd={dragEnd}
              onDragOver={dragOver}
              onDrop={(e) => drop(e, image)}
            >
              <Button
                onClick={() => navigate(`/photos/${image.id}`)}
                sx={{
                  position: 'absolute',
                  top: 7,
                  right: 10,
                  backgroundColor: "#FDE910",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  minWidth: "30px",
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ModeEditIcon style={{ color: "rgb(52, 51, 50)" }} />
              </Button>

              <Button
                onClick={() => handleDeleteClick(image.id)}
                sx={{
                  position: 'absolute',
                  top: 7,
                  left: 10,
                  width: "30px",
                  height: "30px",
                  minWidth: "30px",
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <DeleteIcon style={{ color: "#B00000" }} />
              </Button>
              <img
                src={`${apiUrl}/${image.photo}`}
                alt={`Slide ${index}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          ))
        ) : (
          <div>Данные не загружены.</div>
        )}
      </div>
      <div style={{ marginTop: "40px", display: "flex", justifyContent: "center", marginBottom:"50px" }}>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          style={{ backgroundColor: "#738A6E", color: "white", marginRight: "20px", fontSize: "16px",  borderRadius:"20px", }}
        >
          Сохранить порядок
        </Button>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          variant="contained"
          color="primary"
          style={{ backgroundColor: "#FDE910", color: "rgb(52, 51, 50)", fontSize: "16px",  borderRadius:"20px", }}
        >
          Добавить новое фото
        </Button>
      </div>
      <ModalWindowAddNewPhoto
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <NavLink to="/edition_site" style={{ color:"#738A6E", textDecoration:"none" }}><span><ArrowBackIcon sx={{width:"20px", marginRight:"10px"}}/>Вернуться к редактированию сайта</span></NavLink>
      <ToastContainer />
    </>
  );
};

export default DragAndDropPhoto;