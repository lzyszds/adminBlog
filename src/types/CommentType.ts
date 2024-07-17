export interface getComType {
  comment_id: number;  // 评论id
  content: string;  // 评论内容
  article_id: number; // 文章id
  reply_id: number; // 回复id
  ground_id: number;  // 回复的评论id
  email: string;  // 邮箱
  user_name: string;  // 用户名
  user_ip: string;  // 用户ip
  time: number; // 评论时间
  head_img: string; // 头像
}

