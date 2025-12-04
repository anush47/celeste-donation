export const apiResponse = {
    success: (data: any, message: string = "Success", status: number = 200) => {
        return Response.json(
            {
                success: true,
                message,
                data,
            },
            { status },
        )
    },
    error: (message: string = "Error", status: number = 500, errors: any = null) => {
        return Response.json(
            {
                success: false,
                message,
                errors,
            },
            { status },
        )
    },
}
