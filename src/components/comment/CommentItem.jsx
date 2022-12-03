import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  createComment,
  deleteComment,
  updateComment,
} from "../../redux/feedback/commentSlice";
import { toast } from "react-toastify";
import { formatDistance } from "date-fns";
import viLocale from "date-fns/locale/vi";

const CommentItem = ({ comment }) => {
  const [active, setActive] = useState(false);
  const [textLike, settextLike] = useState(2);
  const [hidden, setHidden] = useState(true);
  const [text, setText] = useState("");
  const [edit, setEdit] = useState(false);

  const dispatch = useDispatch();
  const params = useParams();
  const { current } = useSelector((state) => state.user);
  console.log("CommentItem:", comment);

  const handleSend = () => {
    if (current === null) {
      toast.dismiss();
      toast.warning("Vui lòng đăng nhập để thực hiện", { pauseOnHover: false });
      return;
    }
    const data = {
      comment: text,
      parent: comment.id,
      product: params.id,
    };
    if (data.comment === "") {
      toast.dismiss();
      toast.warning("Vui lòng điền nội dung", { pauseOnHover: false });
      return;
    }
    if (edit) {
      try {
        const data = {
          comment: text,
          id: comment._id,
        };
        dispatch(updateComment(data));
        setEdit(false);
        setHidden(true);
        setText("");
        return;
      } catch (error) {
        console.log(error.message);
        setEdit(false);
        return;
      }
    }
    try {
      dispatch(createComment(data));
      setText("");
    } catch (error) {
      console.log(error.message);
    }
    setHidden(true);
  };

  const handleLike = () => {
    setActive(!active);
    if (active) {
      settextLike(textLike - 1);
    } else {
      settextLike(textLike + 1);
    }
  };

  const handleReply = () => {
    setEdit(false);
    setHidden(!hidden);
    setText("");
  };

  const handleEdit = () => {
    setEdit(true);
    setHidden(!hidden);
    setText(comment?.comment);
  };

  const handleDelete = () => {
    try {
      dispatch(deleteComment(comment?._id));
    } catch (error) {
      console.log(error.message);
    }
  };

  const nestedComments = (comment.children || []).map((comment) => {
    return <CommentItem key={comment.id} comment={comment} type="child" />;
  });

  return (
    <>
      <div className="flex flex-col w-full mt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start gap-x-5">
            <img
              src={comment?.user?.avatar}
              alt=""
              className="rounded-full w-[50px] h-[50px] object-cover"
            />
            <span className="text-lg font-semibold">{comment?.user?.name}</span>
          </div>

          <div className="text-[#8f8f8f] font-semibold text-base">
            {comment?.updateAt
              ? formatDistance(Date.now(), new Date(comment?.updateAt), {
                  locale: viLocale,
                }) + " trước"
              : formatDistance(Date.now(), new Date(comment?.createdAt), {
                  locale: viLocale,
                }) + " trước"}
          </div>
        </div>
        <div className="w-full bg-[#f3f4f6] mt-3 rounded-lg ml-12 flex flex-col p-5  justify-between gap-y-4">
          <div className="flex items-center justify-start gap-x-2 flex-wrap">
            <span className="text-base font-medium">Hỏi đáp:</span>
            <span className="break-all">{comment?.comment}</span>
          </div>
          <div className="flex items-center gap-x-5">
            <div className="flex items-center gap-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={`${active ? "bold" : "none"}`}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="blue"
                className="w-5 h-5 cursor-pointer"
                onClick={handleLike}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
              <span className="text-base font-medium">{textLike}</span>
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="blue"
              className="w-5 h-5 cursor-pointer"
              onClick={handleReply}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
              />
            </svg>
            {current?._id === comment?.user?._id && (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="blue"
                  className="w-5 h-5 cursor-pointer"
                  onClick={handleEdit}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="red"
                  className="w-5 h-5 cursor-pointer"
                  onClick={handleDelete}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </>
            )}
          </div>
        </div>
        {!hidden && !edit && (
          <div className="flex items-start mt-5 gap-x-4 ml-12">
            <textarea
              placeholder="Xin mời bạn để lại câu hỏi, HC.VN sẽ trả lời lại trong 1h, các câu hỏi sau 22h-8h sẽ được trả lời vào sáng hôm sau ..."
              className="w-full h-[150px] bg-[#f8f8f8] p-5 text-base font-medium rounded-lg resize-none border-2 border-solid"
              onChange={(e) => setText(e.target.value)}
            />
            <button
              className="px-6 py-3 rounded-lg bg-red-700 text-white font-bold"
              onClick={handleSend}
            >
              Gửi
            </button>
          </div>
        )}
        {!hidden && edit && (
          <div className="flex items-start mt-5 gap-x-4 ml-12">
            <textarea
              placeholder="Xin mời bạn để lại câu hỏi, HC.VN sẽ trả lời lại trong 1h, các câu hỏi sau 22h-8h sẽ được trả lời vào sáng hôm sau ..."
              className="w-full h-[150px] bg-[#f8f8f8] p-5 text-base font-medium rounded-lg resize-none border-2 border-solid"
              onChange={(e) => setText(e.target.value)}
              value={text}
            />
            <button
              className="px-6 py-3 rounded-lg bg-red-700 text-white font-bold"
              onClick={handleSend}
            >
              Gửi
            </button>
          </div>
        )}
      </div>
      <div className="ml-12">{nestedComments}</div>
    </>
  );
};

export default CommentItem;