import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const apiURL = environment.apiURL;



@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  course: object = {}

  headers = new HttpHeaders();

  constructor(private http: HttpClient) { }

  // Courses

  createCourse(data: any): Observable<any> {
    const route = '/create/course/';
    return this.http.post<any>(`${apiURL}${route}`, data, { headers: this.headers });
  }

  getCourses(): Observable<any> {
    const route = '/my/courses/';
    return this.http.get<any>(`${apiURL}${route}`, { headers: this.headers });
  }

  getCourseById(id: string): Observable<any> {
    const route = `/retrieve/course/${id}/`;
    return this.http.get<any>(`${apiURL}${route}`, { headers: this.headers });
  }

  updateCourse(data: any, id: any): Observable<any> {
    const route = `/update/course/${id}/`;
    return this.http.patch<any>(`${apiURL}${route}`, data, { headers: this.headers });
  }

  deleteCourse(id: string): Observable<any> {
    const route = `/delete/course/${id}/`;
    return this.http.delete<any>(`${apiURL}${route}`, { headers: this.headers });
  }

  approveCourse(id: string): Observable<any> {
    const route = `/approve/course/`;
    return this.http.post<any>(`${apiURL}${route}`, { course_id: id }, { headers: this.headers });
  }

  myApprovedCourse(): Observable<any> {
    const route = `/list/my/courses-approve/`;
    return this.http.get<any>(`${apiURL}${route}`, { headers: this.headers });
  }

  // Modules
  getModules(): Observable<any> {
    const route = '/my/modules/';
    return this.http.get<any>(`${apiURL}${route}`, { headers: this.headers });
  }

  getModuleById(id: string): Observable<any> {
    const route = `/retrieve/module/${id}/`;
    return this.http.get<any>(`${apiURL}${route}`, { headers: this.headers });
  }

  getModulesByCourseId(courseId: string): Observable<any> {
    const route = `/list/modules/${courseId}/`;
    return this.http.get<any>(`${apiURL}${route}`, { headers: this.headers });
  }

  createModule(data: any): Observable<any> {
    const route = '/create/module/';
    return this.http.post<any>(`${apiURL}${route}`, data, { headers: this.headers });
  }

  updateModule(data: any, id: any): Observable<any> {
    const route = `/update/module/${id}/`;
    return this.http.patch<any>(`${apiURL}${route}`, data, { headers: this.headers });
  }

  deleteModule(id: string) {
    const route = `/delete/module/${id}/`;
    return this.http.delete<any>(`${apiURL}${route}`, { headers: this.headers });
  }

  // Topics
  getTopics(): Observable<any> {
    const route = '/my/topics/';
    return this.http.get<any>(`${apiURL}${route}`, { headers: this.headers });
  }

  getTopicById(id: string): Observable<any> {
    const route = `/detail/topics/${id}/`;
    return this.http.get<any>(`${apiURL}${route}`, { headers: this.headers });
  }

  markTopicAsSeen(id: string) {
    const route = '/last-seen/topic/';
    return this.http.post<any>(`${apiURL}${route}`, { topic: id }, { headers: this.headers });
  }

  getTopicsByModuleId(moduleId: string): Observable<any> {
    const route = `/list/topics-by-module/${moduleId}/`;
    return this.http.get<any>(`${apiURL}${route}`, { headers: this.headers });
  }

  getKeepWatching(): Observable<any> {
    const route = '/seeing/topics/';
    return this.http.get<any>(`${apiURL}${route}`, { headers: this.headers });
  }

  createTopic(data: any): Observable<any> {
    const route = '/create/topic/';
    return this.http.post<any>(`${apiURL}${route}`, data, { headers: this.headers });
  }

  updateTopic(data: any, id: any): Observable<any> {
    const route = `/update/topic/${id}/`;
    return this.http.patch<any>(`${apiURL}${route}`, data, { headers: this.headers });
  }

  deleteTopic(id: string) {
    const route = `/delete/topic/${id}/`;
    return this.http.delete<any>(`${apiURL}${route}`, { headers: this.headers });
  }

  // Quizzes
  getQuizzes(): Observable<any> {
    const route = '/my/quizzes/';
    return this.http.get<any>(`${apiURL}${route}`, { headers: this.headers });
  }

  getQuizzesByCourseId(courseId: string): Observable<any> {
    const route = `/list/quizzes/${courseId}/`;
    return this.http.get<any>(`${apiURL}${route}`, { headers: this.headers });
  }

  createQuiz(dataForm: any): Observable<any> {
    const route = '/create/quiz/';
    return this.http.post<any>(`${apiURL}${route}`, dataForm, { headers: this.headers });
  }

  createQuizByStep(DATA: any): Observable<any> {
    const route = '/create/quiz/';
    return this.http.post<any>(`${apiURL}${route}`, DATA, { headers: this.headers });
  }


  updateQuiz(data: any, id: any): Observable<any> {
    const route = `/update/quiz/${id}/`;
    return this.http.patch<any>(`${apiURL}${route}`, data, { headers: this.headers });
  }

  deleteQuiz(id: string) {
    const route = `/delete/quiz/${id}/`;
    return this.http.delete<any>(`${apiURL}${route}`, { headers: this.headers });
  }

}
