import { prismaClient } from "@prisma/client";

const prisma = new prismaClient();
const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany();
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving projects" });
  }
};
const getProjectById = async (req, res) => {
  const { ProjectID } = req.params;
  try {
    const project = await prisma.projects.findUnique({
      where: { ProjectID: parseInt(ProjectID) },
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving project" });
  }
};
const createProject = async (req, res) => {
  try {
    const {
      ProjectName,
      Field,
      ExpiredDate,
      WorkingType,
      Budget,
      Description,
    } = req.body;
    const newProject = await prisma.projects.create({
      data: {
        ProjectName,
        Field,
        ExpiredDate,
        WorkingType,
        Budget,
        Description,
      },
    });
    res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating project" });
  }
};

const updateProject = async (req, res) => {
    const { ProjectID } = req.params;
    try {
        const {
        ProjectName,
        Field,
        ExpiredDate,
        WorkingType,
        Budget,
        Description,
        } = req.body;
        const updatedProject = await prisma.projects.update({
        where: { ProjectID: parseInt(ProjectID) },
        data: {
            ProjectName,
            Field,
            ExpiredDate,
            WorkingType,
            Budget,
            Description,
        },
        });
        res.status(200).json(updatedProject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating project" });
    }
}
const deleteProject = async (req, res) => {
  const { ProjectID } = req.params;
  try {
    await prisma.projects.delete({
      where: { ProjectID: parseInt(ProjectID) },
    });
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting project" });
  }
};
export { getProjects, createProject, updateProject, deleteProject, getProjectById };