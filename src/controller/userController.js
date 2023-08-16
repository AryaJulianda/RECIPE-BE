const { getUserById } = require('../model/authModel');
const {updateUser} = require('../model/userModel')


exports.update = async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  let img;

  if (req.file && req.file.path) {
    img = req.file.path;
  }

  try {
    const oldData = await getUserById(id);
    // console.log(oldData.rows[0].title)
    // console.log(req.body.title)
    console.log(oldData.photo)
    if(!img){ img = oldData.photo};

    const newData = {
      username:username,
      photo: img,
    };

    const result = await updateUser(
      newData.username,
      newData.photo,
      id
    );

    // console.log(result.rows,'result')
    // console.log(oldData,'old')

    res.json({
      message: 'Edit User success',
      new_data: result.rows[0],
      oldData: oldData,
    });
  } catch (err) {
    console.log('edit gagla',err)
    res.status(500).json({ message: err.message });
  }
};
