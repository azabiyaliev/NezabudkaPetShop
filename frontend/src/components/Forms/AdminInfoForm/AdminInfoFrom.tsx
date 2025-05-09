import React, { useEffect, useState } from "react";
import { Box } from "@mui/joy";
import { Button, Typography } from "@mui/material";
import TextEditor from "../../TextEditor/TextEditor.tsx";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import { useNavigate } from "react-router-dom";
import { AdminInfoMutation } from "../../../types";
import { enqueueSnackbar } from "notistack";
import { selectAdminInfo } from "../../../store/adminInfo/adminInfoSlice.ts";
import {
  fetchAdminInfo,
  updateAdminInfo,
} from "../../../store/adminInfo/adminInfoThunk.ts";

const initialState = {
  information: "",
};

const AdminInfoForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState<AdminInfoMutation>(initialState);
  const adminInfo = useAppSelector(selectAdminInfo);

  useEffect(() => {
    dispatch(fetchAdminInfo())
      .unwrap()
      .then((admin) => {
        if (admin) {
          setForm(admin);
        }
      });
  }, [dispatch]);

  const onChangeEditor = (html: string) => {
    setForm((prevState) => ({
      ...prevState,
      information: html,
    }));
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminInfo?.id) {
        enqueueSnackbar(
            "Ваш ID неверный",
            { variant: "error" },
        );
      return;
    }
    try {
      await dispatch(
        updateAdminInfo({ id: adminInfo.id, data: form }),
      ).unwrap();
      enqueueSnackbar(
        "Вы успешно отредактировали личный кабинет администрации",
        { variant: "success" },
      );
      navigate(`/private/admin_info`);
    } catch (error) {
      console.error(error);
        enqueueSnackbar(
            "Не удалось отредактировать личный кабинет администарции",
            { variant: "error" },
        );
    }
  };

  return (
    <Box>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          "@media (max-width: 900px)": {
            marginLeft: 0,
          },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "800px" }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ textAlign: "center", fontWeight: 600 }}
          >
            Редактирование личного кабинета для администариции
          </Typography>

          <Box
            component="form"
            noValidate
            onSubmit={submitHandler}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              mt: "30px",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                alignSelf: "flex-start",
                color: "text.secondary",
                fontWeight: 400,
                mb: 0.5,
              }}
            >
              Информация для администрации:
            </Typography>

            <TextEditor
              value={form.information}
              onChange={onChangeEditor}
              error={!form.information}
              helperText={
                !form.information
                  ? "Поле обязательно для заполнения"
                  : undefined
              }
            />
            <Button
              variant="contained"
              type="submit"
              sx={{ mt: 3, alignSelf: "center", backgroundColor: "darkgreen" }}
            >
              Сохранить
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminInfoForm;
