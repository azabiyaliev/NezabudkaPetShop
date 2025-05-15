import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import {
  selectPhotoCarousel,
  updatePhotoOrder,
} from "../../../store/photoCarousel/photoCarouselSlice.ts";
import { apiUrl } from "../../../globalConstants.ts";
import { Button, Typography } from "@mui/material";
import { DragEvent, useEffect, useState } from "react";
import { PhotoCarousel } from "../../../types";
import { useNavigate } from "react-router-dom";
import {
  deletePhoto,
  fetchPhoto,
  updatePhotoOrders,
} from "../../../store/photoCarousel/photoCarouselThunk.ts";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { enqueueSnackbar } from "notistack";
import { Box } from "@mui/joy";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import AdminBar from "../../../features/Admin/AdminProfile/AdminBar.tsx";
import AddNewPhotoForm from "./AddNewPhotoForm.tsx";
import theme from '../../../globalStyles/globalTheme.ts';


const DragAndDropPhoto = () => {
  const photos = useAppSelector(selectPhotoCarousel) || [];
  const isLoading = useAppSelector((state) => state.photo_carousel.isLoading);
  const dispatch = useAppDispatch();
  const [currentPhoto, setCurrentPhoto] = useState<PhotoCarousel | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchPhoto());
  }, [dispatch]);

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
      const currentIndex = updatedPhotos.findIndex(
        (photo) => photo.id === currentPhoto.id,
      );
      const targetIndex = updatedPhotos.findIndex(
        (photo) => photo.id === targetImage.id,
      );

      [updatedPhotos[currentIndex], updatedPhotos[targetIndex]] = [
        updatedPhotos[targetIndex],
        updatedPhotos[currentIndex],
      ];

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
        title: photo.title,
        description: photo.description,
      }))
      .filter((photo) => photo.id !== undefined);

    try {
      await dispatch(updatePhotoOrders(updatedPhotos)).unwrap();
      navigate("/");
      enqueueSnackbar("Вы успешно изменили порядок фото в карусели!", {
        variant: "success",
      });
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
        confirmButtonColor: theme.colors.warning,
        cancelButtonColor: theme.colors.OLIVE_GREEN,
        confirmButtonText: "Удалить",
        cancelButtonText: "Отмена",
      });

      if (result.isConfirmed) {
        try {
          await dispatch(deletePhoto({ id: photoId })).unwrap();
          enqueueSnackbar("Фотография успешно удалена.", {
            variant: "success",
          });
          await dispatch(fetchPhoto()).unwrap();
        } catch (error) {
          console.error("Ошибка удаления:", error);
          enqueueSnackbar("Не удалось удалить фотографию.", {
            variant: "error",
          });
        }
      }
    } else {
      console.error("Invalid photo ID");
    }
  };

  useEffect(() => {
    document.title = "Управление каруселью";
  }, []);


  return (
    <Box
      sx={{
        display: "flex",
        margin: "30px 0",
        "@media (max-width: 900px)": {
          flexWrap: "wrap",
        },
      }}
    >
      <AdminBar />
      
      <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "100%", maxWidth: "900px", px: 2 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ textAlign: "center", fontWeight: theme.fonts.weight.medium, mt: 2 }}
          >
            Управление каруселью
          </Typography>

          <AddNewPhotoForm />

          <Box
            sx={{
              borderTop: "1px solid lightgray",
              marginTop: "10px",
              marginBottom: "20px",
            }}
          />

          <Typography
            sx={{
              textAlign: "center",
              color: theme.colors.DARK_GRAY,
              marginBottom: theme.spacing.sm,
              fontSize: theme.fonts.size.sm,
            }}
          >
            Чтобы изменить порядок фото, просто перетащите их мышкой
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "50px",
              marginTop: "40px",
              justifyContent: "center",
              "@media (max-width: 900px)": {
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
              },
            }}
          >
            {isLoading ? (
              <div>Загрузка...</div>
            ) : Array.isArray(photos) ? (
              photos.map((image, index) => (
                <Box
                  key={image.id}
                  sx={{
                    width: "250px",
                    height: "150px",
                    overflow: "hidden",
                    borderRadius: theme.spacing.exs,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "grab",
                    position: "relative",
                    "@media (max-width: 420px)": {
                      width: "auto",
                      height: "auto",
                    },
                  }}
                  draggable
                  onDragStart={(e) => dragStart(e, image)}
                  onDragEnd={dragEnd}
                  onDragOver={dragOver}
                  onDrop={(e) => drop(e, image)}
                >
                  <Button
                    onClick={() => navigate(`/photos/${image.id}`)}
                    sx={{
                      position: "absolute",
                      top: 7,
                      right: 10,
                      backgroundColor: theme.colors.primary,
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                      minWidth: "30px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ModeEditIcon style={{ color: theme.colors.white }} />
                  </Button>

                  <Button
                    onClick={() => handleDeleteClick(image.id)}
                    sx={{
                      position: "absolute",
                      top: 7,
                      left: 10,
                      width: "30px",
                      height: "30px",
                      minWidth: "30px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <DeleteIcon style={{ color: theme.colors.error }} />
                  </Button>

                  <Box
                    component="img"
                    src={`${apiUrl}/${image.photo}`}
                    alt={`Slide ${index}`}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      "@media (max-width: 420px)": {
                        width: "100%",
                        height: "auto",
                      },
                    }}
                  />
                </Box>
              ))
            ) : (
              <div>Данные не загружены.</div>
            )}
          </Box>

          <Box
            sx={{
              marginTop: "40px",
              display: "flex",
              justifyContent: "center",
              marginBottom: "50px",
              "@media (max-width: 550px)": {
                display: "none",
              },
            }}
          >
            <Button
              onClick={handleSave}
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: theme.colors.primary,
                color: "white",
              }}
            >
              Сохранить порядок
            </Button>
          </Box>

          <Box
            sx={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            <Button
              onClick={handleSave}
              variant="contained"
              sx={{
                display: "none",
                "@media (max-width: 550px)": {
                  display: "flex",
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.white,
                  borderRadius: "50%",
                  width: "45px",
                  height: "45px",
                  minWidth: "45px",
                  justifyContent: "center",
                  alignItems: "center",
                },
              }}
            >
              <PublishedWithChangesIcon
                style={{ width: "25px", height: "25px" }}
              />
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DragAndDropPhoto;
