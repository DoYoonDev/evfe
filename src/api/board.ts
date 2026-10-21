import { defaultAxios } from "@/config/api"
import { END_POINTS } from "@/constants/api"
import { Board, BoardListFilter } from "@/types/common/board";

// 전체 게시물 조회
export const getBoards = async (): Promise<{ boardInfos: Board[], totlaCount: number }> => {
    const response = await defaultAxios.get(END_POINTS.BOARD);
    return response.data;
};

// 전체 게시물 리스트 조회 (페이징)
export const getBoardPage = async (filter: BoardListFilter): Promise<{
    boardInfos: Board[];
    totalElements: number;
    totalPages: number;
}> => {
    const response = await defaultAxios.get(`${END_POINTS.BOARD}/page`, { params: filter });
    return response.data;
};

// 게시물 상세 조회
export const getBoardDetail = async (id: string): Promise<Board> => {
    const response = await defaultAxios.get(`${END_POINTS.BOARD}/${id}`);
    return response.data;
}

// 첨부파일 다운
export const getAttachFile = async (id: number, saveName: string) => {
    const response = await defaultAxios.get(`${END_POINTS.BOARD}/files/${id}/${saveName}`, {
        responseType: "blob",
        withCredentials: true,
    })

    return response.data
}

// 게시물 수정
export const updateBoard = async (data: { id: number; formData: FormData }): Promise<boolean> => {
    const response = await defaultAxios.put(`${END_POINTS.BOARD}/${data.id}`, data.formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

// 게시글 등록
export const createBoard = async (
    formData: FormData,
): Promise<boolean> => {

    const boardBlob = formData.get("board") as Blob;

    if (boardBlob) {
        // Blob을 텍스트로 읽고 JSON으로 변환
        const boardText = await boardBlob.text();
        const boardData = JSON.parse(boardText);

        console.log("isPin 값 확인:", boardData.isPin); // true / false
    }

    const response = await defaultAxios.post(END_POINTS.BOARD, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
}

// 게시글 삭제
export const deleteBoard = async (id: number): Promise<void> => {
    await defaultAxios.delete(`${END_POINTS.BOARD}/${id}`);
};
