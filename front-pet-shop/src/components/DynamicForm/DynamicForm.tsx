'use client'
import { useForm, SubmitHandler, RegisterOptions, FieldError, Path } from 'react-hook-form';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { TextField, Select, MenuItem, FormControl, InputLabel, TextareaAutosize, FormHelperText, Box, Button, Container, Grid, Avatar, Typography } from '@mui/material'

interface Option {
    label: string;
    value: string;
}

export interface FieldConfig<T extends Record<string, unknown>> {
    name: Path<T>;
    label: string;
    type: FieldType;
    options?: Option[];
    validation?: RegisterOptions;
}

interface DynamicFormProps<T extends Record<string, unknown>> {
    config: FieldConfig<T>[];
    typographyFormTitle?: string;
    buttonSubmitText?: string;
    errorText: string | undefined;
    onSubmit: SubmitHandler<T>;
}

type FieldType = 'input' | 'select' | 'textarea';

export function DynamicForm<T extends Record<string, unknown>>({
                                                                   config,
                                                                   typographyFormTitle = '',
                                                                   buttonSubmitText = 'Отправить',
                                                                   onSubmit,
    errorText,
                                                               }: DynamicFormProps<T>) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<T>();

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: '#FFFFFF',
                    padding: 4,
                    borderRadius: 2,
                    border: '2px solid #FFEB3B',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'white' }}>
                    <LockOutlinedIcon sx={{ color: 'black' }} />
                </Avatar>
                {errorText && (
                    <Typography color="error" sx={{ marginBottom: '16px' }}>
                        {errorText}
                    </Typography>
                )}

                <Typography component="h1" variant="h5" sx={{ color: 'black' }}>
                    {typographyFormTitle}
                </Typography>
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{ mt: 3 }}
                >
                    <Grid container direction="column" spacing={2}>
                        {config.map((field) => {
                            const error = errors[field.name] as FieldError | undefined;

                            return (
                                <Grid item xs={12} key={field.name}>
                                    <label htmlFor={field.name} style={{ display: 'block', marginBottom: 4 }}>
                                        {field.label}
                                    </label>

                                    {field.type === 'input' && (
                                        <TextField
                                            fullWidth
                                            id={field.name}
                                            {...register(field.name, field.validation as RegisterOptions<T, Path<T>>)}
                                            error={!!error}
                                            helperText={error?.message}
                                            variant="outlined"
                                            sx={{
                                                backgroundColor: 'white',
                                                borderRadius: '7px',
                                                marginTop: '10px',
                                            }}
                                        />
                                    )}

                                    {field.type === 'textarea' && (
                                        <div>
                                            <TextareaAutosize
                                                id={field.name}
                                                {...register(field.name, field.validation as RegisterOptions<T, Path<T>>)}
                                                minRows={3}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    borderRadius: '4px',
                                                    border: '1px solid #ccc',
                                                }}
                                            />
                                            {error && error.message && (
                                                <FormHelperText error>{error.message}</FormHelperText>
                                            )}
                                        </div>
                                    )}

                                    {field.type === 'select' && (
                                        <FormControl fullWidth variant="outlined" error={!!error}>
                                            <InputLabel>{field.label}</InputLabel>
                                            <Select
                                                id={field.name}
                                                {...register(field.name, field.validation as RegisterOptions<T, Path<T>>)}
                                                label={field.label}
                                            >
                                                {field.options?.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {error && error.message && (
                                                <FormHelperText>{error.message}</FormHelperText>
                                            )}
                                        </FormControl>
                                    )}
                                </Grid>
                            );
                        })}
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            backgroundColor: '#FFEB3B',
                            color: 'black',
                        }}
                    >
                        {buttonSubmitText}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
