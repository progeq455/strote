const Note = require("../models/Note");
const NoteService = require("../services/note-service");
const Category = require("../models/Category.js");

class NoteController {
  async create(req, res) {
    try {
      const {
        title,
        description,
        icon,
        status,
        statusData,
        color,
        category,
        dataCreated,
      } = req.body;

      let cat;

      if (category) {
        cat = await Category.findOne({
          user: req.user.id,
          _id: category,
        });
      }

      const note = new Note({
        user: req.user.id,
        title: title,
        description: description,
        icon: icon,
        status: status,
        statusData: statusData,
        color: color,
        category: cat ? category : null,
        dataCreated: dataCreated,
      });

      await note.save();
      res.json(note);
    } catch (e) {
      return res.status(400).json(e);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.body;

      const note = await Note.findOne({
        user: req.user.id,
        _id: id,
      });

      if (note) {
        const deletedNote = await NoteService.delete(id);
        return res.json(deletedNote);
      } else {
        res.json({ message: "Ошибка при удалении" });
      }
    } catch (e) {
      return res.status(500).json(e);
    }
  }

  async update(req, res) {
    try {
      const note = await Note.findOne({
        user: req.user.id,
        _id: req.body._id,
      });

      const cat = req.body.category;
      let catg;

      if (cat) {
        catg = await Category.findOne({
          user: req.user.id,
          _id: req.body.category,
        });
      }

      if (cat && !catg) {
        return res.json({ message: "Ошибка при обновлении" });
      }

      if (note) {
        const updatedNote = await NoteService.update(req.body);
        res.json(updatedNote);
      } else {
        res.json({ message: "Ошибка при обновлении" });
      }
    } catch (e) {
      return res.status(500).json(e);
    }
  }

  async getAllNotes(req, res) {
    try {
      const { sort } = req.query;
      const notes = await NoteService.getAll(req.user.id, sort);
      res.json(notes);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getNote(req, res) {
    try {
      const note = await NoteService.getNote(req.user.id, req.body.id);
      res.json(note);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getNotesCategorySort(req, res) {
    try {
      const notesCategory = await NoteService.getNotesCategorySort(
        req.user.id,
        req.body.id
      );
      res.json(notesCategory);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getNotesBasket(req, res) {
    try {
      const notes = await NoteService.getNotesBasket(req.user.id);
      res.json(notes);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async searchNote(req, res) {
    try {
      const searchName = req.query.q;

      let notes = await Note.find({
        user: req.user.id,
        $or: [
          { title: { $regex: searchName } },
          { description: { $regex: searchName } },
        ],
      });

      return res.json(notes);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Ошибка поиска" });
    }
  }

  async getArchiveNotes(req, res) {
    try {
      const { sort } = req.query;
      const id = req.body.id;
      const notes = await NoteService.getArchiveNotes(req.user.id, sort, id);
      res.json(notes);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getCategoryNotes(req, res) {
    try {
      const { sort } = req.query;
      const id = req.body.id;
      const notes = await NoteService.getCategoryNotes(req.user.id, sort, id);
      res.json(notes);
    } catch (e) {
      res.status(500).json(e);
    }
  }
}

module.exports = new NoteController();
