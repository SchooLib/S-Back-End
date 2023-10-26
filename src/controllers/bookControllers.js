const {
  createBook,
  readBooks,
  readBook,
  deleteBooks,
  editBook,
} = require("../services/bookServices");
const {
  removeClassificationBooks,
  createClassificationBooks,
} = require("../services/classificationServices");

exports.addBook = async (req, res) => {
  try {
    const newBook = await createBook(req.body);

    if (req.body.classifications) {
      createClassificationBooks({
        bookId: newBook.id,
        classificationId: req.body.classifications,
      });
    }

    res.status(200).json({
      meta: {
        status: "success",
        message: "The book has been successfully added to the database.",
        code: 200,
      },
      data : newBook
    });
  } catch (error) {
    res.status(400).json({
      meta: {
        status: "failed",
        message: error.message,
        code: 400,
      },
      data: {},
    });
  }
};

exports.retriveBooks = async (req, res) => {
  try {
    const books = await readBooks();
    res.status(200).json({
      meta: {
        status: "success",
        message: "Books retrieved successfully",
        code: 200,
      },
      data: books,
    });
  } catch (error) {
    res.status(400).json({
      meta: {
        status: "failed",
        message: error.message,
        code: 400,
      },
      data: {},
    });
  }
};

exports.retriveBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await readBook(id);
    res.status(200).json({
      meta: {
        status: "success",
        message: "Book retrieved successfully",
        code: 200,
      },
      data: book,
    });
  } catch (error) {
    res.status(400).json({
      meta: {
        status: "failed",
        message: error.message,
        code: 400,
      },
      data: {},
    });
  }
};

exports.updateBooks = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await readBook(id);
    if (!book) {
      res.status(404).json({
        meta: {
          status: "success",
          message: `Book with id ${id} not found!`,
          code: 404,
        },
        data: {},
      });
      return;
    }
    const updatedBook = await editBook(id, req.body);

    if (req.body.classifications) {
      await removeClassificationBooks(id);
      for (const classificationId of req.body.classifications) {
        await createClassificationBooks({
          bookId: book.id,
          classificationId: classificationId,
        });
      }
    }

    res.status(200).json({
      meta: {
        status: "success",
        message: "Book updated successfully",
        code: 200,
      },
      data: await readBook(id),
    });
  } catch (error) {
    res.status(400).json({
      meta: {
        status: "failed",
        message: error.message,
        code: 400,
      },
      data: {},
    });
  }
};

exports.removeBooks = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await readBook(id);
    if (!book) {
      res.status(404).json({
        meta: {
          status: "success",
          message: `Book with id ${id} not found!`,
          code: 404,
        },
        data: {},
      });
      return;
    }

    const deletedBook = await deleteBooks(book);
    res.status(200).json({
      meta: {
        status: "success",
        message: "Book deleted successfully",
        code: 200,
      },
      data: deletedBook,
    });
  } catch (error) {
    res.status(400).json({
      meta: {
        status: "failed",
        message: error.message,
        code: 400,
      },
      data: {},
    });
  }
};
